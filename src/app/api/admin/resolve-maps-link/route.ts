import { isAllowedMapsUrl, resolveMapsCoordinates } from "@/utils/mapsLink";
import { isAuthError, requireAdmin } from "@/utils/requireAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const auth = requireAdmin(request);
    if (isAuthError(auth)) return auth;

    let data: { url?: unknown };
    try {
        data = await request.json();
    } catch (err) {
        console.error("Invalid JSON body:", err);
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    const url = typeof data.url === "string" ? data.url.trim() : "";
    if (!url || !isAllowedMapsUrl(url)) {
        return NextResponse.json(
            { error: "Unsupported maps link" },
            { status: 400 }
        );
    }

    try {
        const coords = await resolveMapsCoordinates(url);
        if (!coords) {
            return NextResponse.json(
                { error: "Could not read coordinates from this link" },
                { status: 400 }
            );
        }
        return NextResponse.json({ ok: true, lat: coords.lat, lng: coords.lng });
    } catch (err) {
        console.error("Failed to resolve maps link:", err);
        return NextResponse.json(
            { error: "Could not resolve maps link" },
            { status: 400 }
        );
    }
}
