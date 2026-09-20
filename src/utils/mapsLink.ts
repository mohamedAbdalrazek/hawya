const EXACT_HOSTS = new Set([
    "maps.app.goo.gl",
    "goo.gl",
    "www.goo.gl",
    "google.com",
    "www.google.com",
    "maps.google.com",
]);

const COORD = "(-?\\d+(?:\\.\\d+)?)";
const MAX_REDIRECTS = 5;

export function isAllowedMapsHost(hostname: string): boolean {
    const host = hostname.trim().toLowerCase().replace(/\.$/, "");
    if (!host) return false;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
    if (host === "localhost" || host.endsWith(".local")) return false;
    if (EXACT_HOSTS.has(host)) return true;
    return host.endsWith(".google.com");
}

export function isAllowedMapsUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        return (
            (url.protocol === "http:" || url.protocol === "https:") &&
            isAllowedMapsHost(url.hostname)
        );
    } catch {
        return false;
    }
}

function validCoords(
    lat: number,
    lng: number
): { lat: number; lng: number } | null {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat, lng };
}

function coordsFromPair(
    rawLat: string,
    rawLng: string
): { lat: number; lng: number } | null {
    return validCoords(Number(rawLat), Number(rawLng));
}

export function parseMapsCoordinates(
    urlString: string
): { lat: number; lng: number } | null {
    let url: URL;
    try {
        url = new URL(urlString);
    } catch {
        return null;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return null;
    }

    const href = url.href;
    const place = href.match(new RegExp(`!3d${COORD}!4d${COORD}`));
    if (place) {
        const parsed = coordsFromPair(place[1], place[2]);
        if (parsed) return parsed;
    }

    const at = href.match(new RegExp(`@${COORD},${COORD}`));
    if (at) {
        const parsed = coordsFromPair(at[1], at[2]);
        if (parsed) return parsed;
    }

    for (const key of ["q", "query", "destination", "ll"]) {
        const value = url.searchParams.get(key);
        if (!value) continue;
        const match = value.match(
            new RegExp(`^\\s*${COORD}\\s*,\\s*${COORD}\\s*$`)
        );
        if (match) {
            const parsed = coordsFromPair(match[1], match[2]);
            if (parsed) return parsed;
        }
    }

    return null;
}

export function mapsSearchQueryFromUrl(urlString: string): string | null {
    let url: URL;
    try {
        url = new URL(urlString);
    } catch {
        return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex(
        (part) => part === "place" || part === "search"
    );
    if (idx >= 0 && parts[idx + 1]) {
        try {
            const query = decodeURIComponent(
                parts[idx + 1].replace(/\+/g, " ")
            ).trim();
            return query || null;
        } catch {
            return null;
        }
    }

    for (const key of ["q", "query", "destination"]) {
        const value = url.searchParams.get(key)?.trim();
        if (value) return value;
    }

    return null;
}

export function parseMapsSearchPayload(
    body: string
): { lat: number; lng: number } | null {
    const match = body.match(
        new RegExp(`\\[null,null,${COORD},${COORD}\\]`)
    );
    if (!match) return null;
    return coordsFromPair(match[1], match[2]);
}

async function lookupMapsSearchCoords(
    query: string
): Promise<{ lat: number; lng: number } | null> {
    const searchUrl = new URL("https://www.google.com/search");
    searchUrl.searchParams.set("tbm", "map");
    searchUrl.searchParams.set("hl", "en");
    searchUrl.searchParams.set("gl", "sa");
    searchUrl.searchParams.set("q", query);

    const response = await fetch(searchUrl, {
        method: "GET",
        redirect: "manual",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;
    return parseMapsSearchPayload(await response.text());
}

export async function resolveMapsCoordinates(
    urlString: string
): Promise<{ lat: number; lng: number } | null> {
    const resolved = await resolveMapsUrl(urlString);
    const fromUrl = parseMapsCoordinates(resolved);
    if (fromUrl) return fromUrl;

    const query = mapsSearchQueryFromUrl(resolved);
    if (!query) return null;
    return lookupMapsSearchCoords(query);
}

export async function resolveMapsUrl(urlString: string): Promise<string> {
    let current = urlString;

    for (let i = 0; i < MAX_REDIRECTS; i++) {
        const parsed = new URL(current);
        if (!isAllowedMapsHost(parsed.hostname)) {
            throw new Error("Blocked host");
        }
        if (parseMapsCoordinates(current)) {
            return current;
        }

        const response = await fetch(current, {
            method: "GET",
            redirect: "manual",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MarakebLocations/1.0)",
            },
            signal: AbortSignal.timeout(8000),
        });

        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get("location");
            if (!location) break;
            const next = new URL(location, current);
            if (!isAllowedMapsHost(next.hostname)) {
                throw new Error("Blocked redirect host");
            }
            current = next.toString();
            continue;
        }

        break;
    }

    return current;
}
