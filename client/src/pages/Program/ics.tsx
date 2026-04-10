import PROGRAMS from "./program.json";
import type { Day, DayId, ProgramKey } from "./program.types";

const DAY_INDEX: Record<DayId, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
};

/**
 * ICS LOCAL TIME FORMAT (NO timezone conversion)
 * YYYYMMDDTHHMMSS
 */
function formatICSDateLocal(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        date.getFullYear() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
}

/**
 * Returns start of current week (Sunday 00:00 local time)
 */
function getWeekStart(now: Date) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
}

export function generateICS(prog: ProgramKey, times: Record<DayId, string>) {
    const P = PROGRAMS[prog];
    const now = new Date();
    const weekStart = getWeekStart(now);

    const events = (P.days as Day[])
        .filter((d) => d.type === "train")
        .map((d) => {
            const time = times[d.id];
            if (!time) return null;

            const [hour, minute] = time.split(":").map(Number);

            const start = new Date(weekStart);
            start.setDate(weekStart.getDate() + DAY_INDEX[d.id]);
            start.setHours(hour, minute, 0, 0);

            const end = new Date(start);
            end.setMinutes(end.getMinutes() + 90); // 1.5h session

            const title = P.sessions?.[d.id]?.title ?? "Training";

            return [
                "BEGIN:VEVENT",
                `DTSTART:${formatICSDateLocal(start)}`,
                `DTEND:${formatICSDateLocal(end)}`,
                `SUMMARY:${title}`,
                `DESCRIPTION:`,
                "END:VEVENT",
            ].join("\n");
        })
        .filter(Boolean)
        .join("\n");

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        events,
        "END:VCALENDAR",
    ].join("\n");
}

export function downloadICS(content: string) {
    const blob = new Blob([content], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "training_schedule.ics";
    a.click();

    URL.revokeObjectURL(url);
}
