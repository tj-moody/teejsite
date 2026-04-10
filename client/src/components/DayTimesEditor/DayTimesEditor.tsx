import type { DayId } from "../../pages/Program/program.types.tsx";

const DAY_ORDER: DayId[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DAY_LABEL: Record<DayId, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
};

type Props = {
    value: Record<DayId, string>;
    onChange: (next: Record<DayId, string>) => void;
};

export default function DayTimesEditor({ value, onChange }: Props) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 6,
            }}
        >
            {DAY_ORDER.map((day) => (
                <div
                    key={day}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 8px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        transition: "border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                            "rgba(255,255,255,0.15)";
                        (e.currentTarget as HTMLDivElement).style.background =
                            "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                            "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLDivElement).style.background =
                            "rgba(255,255,255,0.03)";
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            fontWeight: 500,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.4)",
                        }}
                    >
                        {DAY_LABEL[day]}
                    </span>

                    <input
                        type="time"
                        value={value[day]}
                        onChange={(e) =>
                            onChange({ ...value, [day]: e.target.value })
                        }
                        style={{
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 0,
                            padding: "2px 0",
                            color: "rgba(255,255,255,0.85)",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 12,
                            fontWeight: 500,
                            outline: "none",
                            cursor: "pointer",
                            letterSpacing: "0.02em",
                            width: "100%",
                            textAlign: "center",
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
