import { DayHours, Weekday } from "./types";

export type WeeklyHours = Record<Weekday, DayHours>;

export const WEEKDAYS: Weekday[] = [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
];

const DAY_LABELS = {
    en: {
        saturday: "Sat",
        sunday: "Sun",
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
    },
    ar: {
        saturday: "السبت",
        sunday: "الأحد",
        monday: "الاثنين",
        tuesday: "الثلاثاء",
        wednesday: "الأربعاء",
        thursday: "الخميس",
        friday: "الجمعة",
    },
} as const;

export function createDailyHours(
    open = "08:00",
    close = "22:00"
): WeeklyHours {
    return Object.fromEntries(
        WEEKDAYS.map((day) => [day, { closed: false, open, close }])
    ) as WeeklyHours;
}

function hoursKey(day: DayHours): string {
    return day.closed ? "closed" : `${day.open}-${day.close}`;
}

function formatTime(hhmm: string, locale: "en" | "ar"): string {
    const [hourStr, minuteStr] = hhmm.split(":");
    const hours = Number(hourStr);
    const minutes = Number(minuteStr);
    const periodIsPm = hours >= 12;
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const mm = minutes.toString().padStart(2, "0");
    if (locale === "ar") {
        return `${hour12}:${mm} ${periodIsPm ? "مساءً" : "صباحًا"}`;
    }
    return `${hour12}:${mm} ${periodIsPm ? "PM" : "AM"}`;
}

function formatDayHours(day: DayHours, locale: "en" | "ar"): string {
    if (day.closed) {
        return locale === "ar" ? "مغلق" : "Closed";
    }
    return `${formatTime(day.open, locale)} - ${formatTime(day.close, locale)}`;
}

function rangeLabel(start: Weekday, end: Weekday, locale: "en" | "ar"): string {
    const labels = DAY_LABELS[locale];
    if (start === end) return labels[start];
    const sep = locale === "ar" ? " - " : "-";
    return `${labels[start]}${sep}${labels[end]}`;
}

function allOpenAndIdentical(hours: WeeklyHours): boolean {
    const first = hours.saturday;
    if (first.closed) return false;
    const key = hoursKey(first);
    return WEEKDAYS.every(
        (day) => !hours[day].closed && hoursKey(hours[day]) === key
    );
}

function satThuIdentical(hours: WeeklyHours): boolean {
    const satThu: Weekday[] = [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
    ];
    const key = hoursKey(hours.saturday);
    return satThu.every((day) => hoursKey(hours[day]) === key);
}

export function formatHours(hours: WeeklyHours, locale: string): string {
    const loc = locale.startsWith("ar") ? "ar" : "en";

    if (allOpenAndIdentical(hours)) {
        const prefix = loc === "ar" ? "يوميًا" : "Daily";
        return `${prefix}: ${formatDayHours(hours.saturday, loc)}`;
    }

    if (
        satThuIdentical(hours) &&
        hoursKey(hours.friday) !== hoursKey(hours.saturday)
    ) {
        return [
            `${rangeLabel("saturday", "thursday", loc)}: ${formatDayHours(hours.saturday, loc)}`,
            `${rangeLabel("friday", "friday", loc)}: ${formatDayHours(hours.friday, loc)}`,
        ].join(" | ");
    }

    const groups: { start: Weekday; end: Weekday }[] = [];
    for (const day of WEEKDAYS) {
        const last = groups[groups.length - 1];
        if (last && hoursKey(hours[last.end]) === hoursKey(hours[day])) {
            last.end = day;
        } else {
            groups.push({ start: day, end: day });
        }
    }

    return groups
        .map(
            (group) =>
                `${rangeLabel(group.start, group.end, loc)}: ${formatDayHours(hours[group.start], loc)}`
        )
        .join(" | ");
}
