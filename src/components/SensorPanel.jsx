import React from "react";

export default function SensorPanel({
                                        temperature,
                                        setTemperature,
                                        occupancy,
                                        setOccupancy,
                                        timeOfDay,
                                        setTimeOfDay,
                                        mode,
                                        customThreshold,
                                        setCustomThreshold,
                                    }) {
    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Sensor Simulation</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-300">Temperature</label>
                        <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm text-cyan-300">{temperature}°C</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="30"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="mt-4 w-full accent-cyan-400"
                    />
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-4">
                    <label className="text-sm text-slate-300">Occupancy</label>
                    <button
                        onClick={() => setOccupancy((v) => !v)}
                        className={`mt-3 w-full rounded-2xl px-4 py-3 font-medium ${
                            occupancy ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-100"
                        }`}
                    >
                        {occupancy ? "Present" : "Not Present"}
                    </button>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-4">
                    <label className="text-sm text-slate-300">Time of Day</label>
                    <select
                        value={timeOfDay}
                        onChange={(e) => setTimeOfDay(e.target.value)}
                        className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
                    >
                        {["Morning", "Afternoon", "Evening", "Night"].map((t) => (
                            <option key={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-4">
                    <label className="text-sm text-slate-300">Custom Threshold</label>
                    <input
                        type="number"
                        min="10"
                        max="30"
                        value={customThreshold}
                        disabled={mode !== "Custom"}
                        onChange={(e) => setCustomThreshold(Number(e.target.value))}
                        className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 disabled:opacity-50"
                    />
                </div>
            </div>
        </section>
    );
}