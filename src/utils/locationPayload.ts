import { WEEKDAYS } from "./locationHours";
import { DayHours, LocationWrite, Weekday } from "./types";

const TIME = /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;

export function normalizeTime(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const match = value.trim().match(TIME);
    if (!match) return null;
    return `${match[1]}:${match[2]}`;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function parseDayHours(value: unknown): DayHours | null {
    if (!value || typeof value !== "object") return null;
    const day = value as Partial<DayHours>;
    if (typeof day.closed !== "boolean") return null;
    if (day.closed) {
        return {
            closed: true,
            open: normalizeTime(day.open) ?? "08:00",
            close: normalizeTime(day.close) ?? "22:00",
        };
    }
    const open = normalizeTime(day.open);
    const close = normalizeTime(day.close);
    if (!open || !close || close <= open) return null;
    return { closed: false, open, close };
}

export function parseLocationWrite(
    data: unknown
): LocationWrite | { error: string } {
    if (!data || typeof data !== "object") {
        return { error: "Invalid request body" };
    }
    const body = data as Record<string, unknown>;
    const name = body.name as { en?: unknown; ar?: unknown } | undefined;
    const address = body.address as { en?: unknown; ar?: unknown } | undefined;

    if (!name || !isNonEmptyString(name.en) || !isNonEmptyString(name.ar)) {
        return { error: "Name is required in English and Arabic" };
    }
    if (
        !address ||
        !isNonEmptyString(address.en) ||
        !isNonEmptyString(address.ar)
    ) {
        return { error: "Address is required in English and Arabic" };
    }
    if (!isNonEmptyString(body.phone)) {
        return { error: "Phone is required" };
    }

    const lat = Number(body.lat);
    const lng = Number(body.lng);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        return { error: "A valid map pin is required" };
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
        return { error: "A valid map pin is required" };
    }

    const sortOrder = Number(body.sortOrder);
    if (!Number.isFinite(sortOrder)) {
        return { error: "Sort order is required" };
    }

    if (!body.hours || typeof body.hours !== "object") {
        return { error: "Weekly hours are required" };
    }
    const hours = {} as Record<Weekday, DayHours>;
    for (const day of WEEKDAYS) {
        const parsed = parseDayHours(
            (body.hours as Record<string, unknown>)[day]
        );
        if (!parsed) {
            return { error: "Weekly hours are invalid" };
        }
        hours[day] = parsed;
    }

    return {
        name: { en: name.en.trim(), ar: name.ar.trim() },
        address: { en: address.en.trim(), ar: address.ar.trim() },
        phone: body.phone.trim(),
        hours,
        lat,
        lng,
        sortOrder,
    };
}

export function isLocationWriteError(
    value: LocationWrite | { error: string }
): value is { error: string } {
    return "error" in value;
}
