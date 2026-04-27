import React from "react";

const StatCard = ({title, value, tone}) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">{title}</p>
        <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
);

export default function StatusCards({temperature, occupancy, mode, scenario, automationState}) {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Temperature" value={`${temperature}°C`} tone="text-cyan-300"/>
            <StatCard title="Occupancy" value={occupancy ? "Present" : "Not Present"} tone={occupancy ? "text-emerald-300" : "text-rose-300"}/>
            <StatCard title="Lighting" value={automationState.lights} tone={automationState.lights === "ON" ? "text-amber-300" : "text-slate-300"}/>
            <StatCard title="Heating" value={automationState.heating} tone={automationState.heating === "ON" ? "text-orange-300" : "text-slate-300"}/>
            <StatCard title="Mode" value={mode} tone="text-violet-300"/>
            <StatCard title="Threshold" value={`${scenario.heatingThreshold}°C`} tone="text-cyan-300"/>
            <StatCard title="Triggered Rules" value={automationState.triggeredRules.length} tone="text-emerald-300"/>
            <StatCard title="Energy Note" value={scenario.energyNote} tone="text-slate-200"/>
        </section>
    );
}