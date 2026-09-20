import {
    createDailyHours,
    formatHours,
    WEEKDAYS,
    type WeeklyHours,
} from "./locationHours";

const jubailHours = (): WeeklyHours => {
    const hours = createDailyHours("08:00", "22:00");
    hours.friday = { closed: false, open: "16:00", close: "22:00" };
    return hours;
};

describe("formatHours", () => {
    it("formats seven identical open days as Daily in English", () => {
        expect(formatHours(createDailyHours("08:00", "22:00"), "en")).toBe(
            "Daily: 8:00 AM - 10:00 PM"
        );
    });

    it("formats seven identical open days as Daily in Arabic", () => {
        expect(formatHours(createDailyHours("08:00", "22:00"), "ar")).toBe(
            "يوميًا: 8:00 صباحًا - 10:00 مساءً"
        );
    });

    it("formats Al Zuhur daily 8–11 in both locales", () => {
        const hours = createDailyHours("08:00", "23:00");
        expect(formatHours(hours, "en")).toBe("Daily: 8:00 AM - 11:00 PM");
        expect(formatHours(hours, "ar")).toBe(
            "يوميًا: 8:00 صباحًا - 11:00 مساءً"
        );
    });

    it("uses Jubail Sat–Thu / Fri phrasing in English", () => {
        expect(formatHours(jubailHours(), "en")).toBe(
            "Sat-Thu: 8:00 AM - 10:00 PM | Fri: 4:00 PM - 10:00 PM"
        );
    });

    it("uses Jubail Sat–Thu / Fri phrasing in Arabic", () => {
        expect(formatHours(jubailHours(), "ar")).toBe(
            "السبت - الخميس: 8:00 صباحًا - 10:00 مساءً | الجمعة: 4:00 مساءً - 10:00 مساءً"
        );
    });

    it("lists mixed days compactly and marks a closed day", () => {
        const hours = createDailyHours("08:00", "22:00");
        hours.monday = { closed: true, open: "08:00", close: "22:00" };
        hours.tuesday = { closed: false, open: "09:00", close: "17:00" };
        hours.wednesday = { closed: false, open: "09:00", close: "17:00" };
        hours.thursday = { closed: false, open: "09:00", close: "17:00" };
        hours.friday = { closed: false, open: "09:00", close: "17:00" };

        expect(formatHours(hours, "en")).toBe(
            "Sat-Sun: 8:00 AM - 10:00 PM | Mon: Closed | Tue-Fri: 9:00 AM - 5:00 PM"
        );
    });

    it("lists a fully closed week as a Saturday–Friday range", () => {
        const hours = Object.fromEntries(
            WEEKDAYS.map((day) => [
                day,
                { closed: true, open: "08:00", close: "22:00" },
            ])
        ) as WeeklyHours;

        expect(formatHours(hours, "en")).toBe("Sat-Fri: Closed");
        expect(formatHours(hours, "ar")).toBe("السبت - الجمعة: مغلق");
    });
});
