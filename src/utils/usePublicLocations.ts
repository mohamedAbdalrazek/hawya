"use client";

import { formatHours } from "@/utils/locationHours";
import { LocationMap } from "@/utils/types";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export type PublicLocationView = {
    id: string;
    city: string;
    address: string;
    phone: string;
    hours: string;
    lat: number;
    lng: number;
};

let cache: LocationMap[] | null = null;
let inflight: Promise<LocationMap[]> | null = null;

async function fetchLocations(): Promise<LocationMap[]> {
    if (cache) return cache;
    if (inflight) return inflight;

    inflight = (async () => {
        const response = await fetch("/api/getLocations");
        if (!response.ok) {
            throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        const locations = (data.locations ?? []) as LocationMap[];
        cache = locations;
        return locations;
    })().finally(() => {
        inflight = null;
    });

    return inflight;
}

function toView(
    locations: LocationMap[],
    locale: string
): PublicLocationView[] {
    const loc = locale.startsWith("ar") ? "ar" : "en";
    return locations.map((location) => ({
        id: location.id,
        city: location.name[loc] || location.name.en,
        address: location.address[loc] || location.address.en,
        phone: location.phone,
        hours: formatHours(location.hours, loc),
        lat: location.lat,
        lng: location.lng,
    }));
}

export function usePublicLocations() {
    const locale = useLocale();
    const [locations, setLocations] = useState<PublicLocationView[]>(() =>
        cache ? toView(cache, locale) : []
    );
    const [loading, setLoading] = useState(!cache);

    useEffect(() => {
        let cancelled = false;
        fetchLocations()
            .then((data) => {
                if (!cancelled) {
                    setLocations(toView(data, locale));
                }
            })
            .catch((error) => {
                console.error(error);
                if (!cancelled) {
                    setLocations([]);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [locale]);

    return { locations, loading };
}
