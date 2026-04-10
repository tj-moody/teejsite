import PROGRAMS from "./program.json";

export type ProgramKey = keyof typeof PROGRAMS;
export type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Day = {
    id: DayId;
    label: string;
    sub: string;
    type: "train" | "rest" | "practice" | "tourn";
};
