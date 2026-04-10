import { useState } from "react";
import "./program.css";

import type { Day, DayId, ProgramKey } from "./program.types";
import DayTimesEditor from "../../components/DayTimesEditor/DayTimesEditor.tsx";
import { generateICS, downloadICS } from "./ics";
import PROGRAMS from "./program.json";

const FontLink = () => (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');`}</style>
);

const T = {
    surface: "#141618",
    border: "#2a2d33",
    muted: "#8a8d94",
    dim: "#4d5059",

    pre: "#e8a020",
    practice: "#4a9eff",
    tourn: "#e05555",

    practiceD: "#1a4a80",
    tournD: "#5a2222",

    practiceBg: "rgba(74,158,255,0.10)",
    tournBg: "rgba(224,85,85,0.08)",
};

const TODAY_MAP: DayId[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const DAY_TIMES_KEY = "dayTimes.v1";
const PROG_KEY = "prog.v1";
const defaultDayTimes: Record<DayId, string> = {
    mon: "17:00",
    tue: "17:00",
    wed: "17:00",
    thu: "17:00",
    fri: "17:00",
    sat: "10:00",
    sun: "10:00",
};

function getInitialDay(prog: ProgramKey): DayId {
    const P = PROGRAMS[prog];
    const todayId = TODAY_MAP[new Date().getDay()];

    const today = P.days.find((d) => d.id === todayId);

    if (today && today.type === "train") {
        return today.id as DayId;
    }

    const firstTrain = P.days.find((d) => d.type === "train");
    return (firstTrain?.id ?? P.days[0].id) as DayId;
}

export default function Program() {
    const [prog, setProg] = useState<ProgramKey>(() => {
        if (typeof window === "undefined") return "season" as ProgramKey;

        const saved = localStorage.getItem(PROG_KEY);
        if (!saved) return "season" as ProgramKey;

        return saved as ProgramKey;
    });
    const [day, setDay] = useState<DayId>(() => getInitialDay("season"));
    const [openEx, setOpenEx] = useState<Record<string, boolean>>({});
    const [dayTimes, setDayTimes] = useState<Record<DayId, string>>(() => {
        if (typeof window === "undefined") return defaultDayTimes;

        const saved = localStorage.getItem(DAY_TIMES_KEY);
        if (!saved) return defaultDayTimes;

        try {
            return JSON.parse(saved);
        } catch {
            return defaultDayTimes;
        }
    });

    const P = PROGRAMS[prog];
    const accent = P.accent;

    function switchProg(id: ProgramKey) {
        setProg(id);
        localStorage.setItem(PROG_KEY, id);
        setDay(getInitialDay(id));
        setOpenEx({});
    }

    function switchDay(d: Day) {
        if (d.type === "rest" || d.type === "tourn" || d.type === "practice")
            return;
        setDay(d.id);
        setOpenEx({});
    }

    function toggleEx(key: ProgramKey) {
        setOpenEx((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    const sess = P.sessions[day];

    const dayTypeColor = (d: Day) => {
        if (d.id === day) return accent;
        if (d.type === "practice") return T.practice;
        if (d.type === "tourn") return T.tourn;
        if (d.type === "rest") return T.dim;
        return T.muted;
    };

    return (
        <>
            <FontLink />
            <div className="program-root">
                <div className="program-container">
                    <div style={{ marginBottom: "1rem" }}>
                        <div className="program-header-small">
                            Ultimate Frisbee · Training Program
                        </div>
                        <h1 className="program-title">Weekly Blocks</h1>
                    </div>

                    <div className="grid-4">
                        {Object.values(PROGRAMS).map((p) => {
                            const active = prog === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() =>
                                        switchProg(p.id as ProgramKey)
                                    }
                                    className={`card-btn ${active ? "active" : ""}`}
                                    style={
                                        {
                                            "--accent": p.accent,
                                            "--accent-bg": p.accentBg,
                                        } as React.CSSProperties
                                    }
                                >
                                    <div
                                        className="program-card-title"
                                        style={{
                                            color: active
                                                ? p.accent
                                                : "var(--text)",
                                        }}
                                    >
                                        {p.label}
                                    </div>
                                    <div
                                        className="program-card-subtitle"
                                        style={{
                                            color: active
                                                ? p.accent
                                                : "var(--muted)",
                                            opacity: active ? 0.8 : 1,
                                        }}
                                    >
                                        {p.sublabel}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid-7">
                        {(P.days as Day[]).map((d) => {
                            const isActive = d.id === day;
                            const isRest = d.type === "rest";
                            const isTourn = d.type === "tourn";
                            const isPrac = d.type === "practice";

                            const bg = isActive
                                ? P.accentBg
                                : isPrac
                                  ? T.practiceBg
                                  : isTourn
                                    ? T.tournBg
                                    : T.surface;

                            const borderColor = isActive
                                ? accent
                                : isTourn
                                  ? T.tournD
                                  : isPrac
                                    ? T.practiceD
                                    : T.border;

                            const cursor = isRest ? "default" : "pointer";

                            const opacity = isRest ? 0.35 : isActive ? 1 : 0.8;

                            return (
                                <button
                                    key={d.id}
                                    onClick={() => switchDay(d)}
                                    className="day-btn"
                                    style={
                                        {
                                            "--bg": bg,
                                            "--border-color": borderColor,
                                            "--cursor": cursor,
                                            "--opacity": opacity,
                                        } as React.CSSProperties
                                    }
                                >
                                    <div
                                        className="day-label"
                                        style={{ color: dayTypeColor(d) }}
                                    >
                                        {d.label}
                                    </div>

                                    <div
                                        className="day-sub"
                                        style={{
                                            color: isActive ? accent : T.dim,
                                        }}
                                    >
                                        {d.sub}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {sess && (
                        <div
                            className="session-card"
                            style={
                                { "--accent": accent } as React.CSSProperties
                            }
                        >
                            <div className="session-header">
                                <h2 className="session-title">{sess.title}</h2>
                                <div className="session-sub">{sess.sub}</div>
                            </div>

                            {sess.metrics && (
                                <div className="metrics-grid">
                                    {sess.metrics.map((m, i) => (
                                        <div key={i} className="metric-box">
                                            <div className="metric-val">
                                                {m.val}
                                            </div>
                                            <div className="metric-label">
                                                {m.lbl}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {sess.sections.map((sec, si) => (
                                <div key={si} className="section">
                                    <div className="section-label">
                                        {sec.label}
                                    </div>
                                    <div className="exercise-list">
                                        {sec.exercises.map((ex, ei) => {
                                            const key =
                                                `${si}_${ei}` as ProgramKey;
                                            const isOpen = !!openEx[key];
                                            return (
                                                <div
                                                    key={ei}
                                                    onClick={() =>
                                                        toggleEx(key)
                                                    }
                                                    className={`exercise ${isOpen ? "open" : ""}`}
                                                >
                                                    <div className="exercise-row">
                                                        <span className="exercise-index">
                                                            {String(
                                                                ei + 1,
                                                            ).padStart(2, "0")}
                                                        </span>
                                                        <span className="exercise-name">
                                                            {ex.name}
                                                        </span>
                                                        <span className="exercise-scheme">
                                                            {ex.scheme}
                                                        </span>
                                                        <span className="exercise-arrow">
                                                            ▶
                                                        </span>
                                                    </div>
                                                    {isOpen && (
                                                        <div className="exercise-detail">
                                                            <p className="exercise-text">
                                                                {ex.detail}
                                                            </p>
                                                            {ex.cue && (
                                                                <p className="exercise-cue">
                                                                    ↳ {ex.cue}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            <div className="session-note">
                                <p>{sess.note}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            const ics = generateICS(prog, dayTimes);
                            downloadICS(ics);
                        }}
                        className="export-btn"
                    >
                        Export Training Schedule (.ics)
                    </button>
                    <DayTimesEditor
                        value={dayTimes}
                        onChange={(times) => {
                            setDayTimes(times);
                            localStorage.setItem(
                                DAY_TIMES_KEY,
                                JSON.stringify(times),
                            );
                        }}
                    />
                </div>
            </div>
        </>
    );
}
