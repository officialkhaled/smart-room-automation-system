import React, {useState} from "react";

export default function AddRuleModal({open, onClose, onAddRule}) {
    const [conditionType, setConditionType] = useState("temperature_below");
    const [conditionValue, setConditionValue] = useState(18);
    const [action, setAction] = useState("TURN_LIGHTS_ON");

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const labels = {
            temperature_below: `Temperature below ${conditionValue}°C`,
            temperature_above: `Temperature at/above ${conditionValue}°C`,
            occupancy_present: conditionValue ? "Occupancy is present" : "Occupancy is not present",
            time_of_day: `Time of day is ${conditionValue}`,
        };
        const actions = {
            TURN_LIGHTS_ON: "Lights ON",
            TURN_LIGHTS_OFF: "Lights OFF",
            TURN_HEATING_ON: "Heating ON",
            TURN_HEATING_OFF: "Heating OFF",
        };

        onAddRule({
            label: `${labels[conditionType]} → ${actions[action]}`,
            conditionType,
            conditionValue: conditionType === "occupancy_present" ? conditionValue === "true" : conditionValue,
            action,
            priority: 50,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-3xl bg-slate-900 p-6">
                <h3 className="text-xl font-semibold">Add Custom Rule</h3>

                <div className="mt-4 grid gap-4">
                    <select value={conditionType} onChange={(e) => setConditionType(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                        <option value="temperature_below">Temperature below value</option>
                        <option value="temperature_above">Temperature above value</option>
                        <option value="occupancy_present">Occupancy is present / not present</option>
                        <option value="time_of_day">Time of day is selected value</option>
                    </select>

                    {conditionType === "occupancy_present" ? (
                        <select value={String(conditionValue)} onChange={(e) => setConditionValue(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                            <option value="true">Occupancy is present</option>
                            <option value="false">Occupancy is not present</option>
                        </select>
                    ) : conditionType === "time_of_day" ? (
                        <select value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                            {["Morning", "Afternoon", "Evening", "Night"].map((t) => <option key={t}>{t}</option>)}
                        </select>
                    ) : (
                        <input type="number" value={conditionValue} min="10" max="30" onChange={(e) => setConditionValue(Number(e.target.value))} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"/>
                    )}

                    <select value={action} onChange={(e) => setAction(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                        <option value="TURN_LIGHTS_ON">Turn lights ON</option>
                        <option value="TURN_LIGHTS_OFF">Turn lights OFF</option>
                        <option value="TURN_HEATING_ON">Turn heating ON</option>
                        <option value="TURN_HEATING_OFF">Turn heating OFF</option>
                    </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-full bg-slate-800 px-4 py-2">
                        Cancel
                    </button>
                    <button type="submit" className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950">
                        Save Rule
                    </button>
                </div>
            </form>
        </div>
    );
}