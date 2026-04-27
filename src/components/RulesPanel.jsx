import React, {useState} from "react";
import AddRuleModal from "./AddRuleModal";

export default function RulesPanel({
                                       rules,
                                       mode,
                                       scenario,
                                       onAddRule,
                                       onResetRules,
                                       customRules,
                                       automationState,
                                       temperature,
                                       occupancy,
                                       timeOfDay,
                                   }) {
    const [open, setOpen] = useState(false);

    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">Rule Definitions</h2>
                    <p className="text-sm text-slate-400">Mode: {mode} · Threshold: {scenario.heatingThreshold}°C</p>
                </div>
                <button onClick={() => setOpen(true)} className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
                    Add Rule
                </button>
            </div>

            <button onClick={onResetRules} className="mt-4 text-sm text-slate-400 underline">
                Reset custom rules
            </button>

            <div className="mt-5 space-y-3">
                {rules.map((rule) => (
                    <div key={rule.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <p className="font-medium">{rule.label}</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Action: {rule.action} · Priority: {rule.priority || 0}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-5 rounded-2xl bg-slate-950/60 p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">Triggered rules</p>
                <ul className="mt-2 space-y-1">
                    {automationState.triggeredRules.map((r, i) => <li key={i}>• {r}</li>)}
                </ul>
            </div>

            <AddRuleModal
                open={open}
                onClose={() => setOpen(false)}
                onAddRule={(rule) => {
                    onAddRule(rule);
                    setOpen(false);
                }}
                temperature={temperature}
                occupancy={occupancy}
                timeOfDay={timeOfDay}
            />
        </section>
    );
}