export default function ArchitecturePanel() {
    const steps = ["User Controls", "Sensor State", "Rule Engine", "Automation Output", "Dashboard Display"];
    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Architecture</h2>
            <p className="mt-2 text-sm text-slate-400">
                React components manage UI, while local state and a pure rule engine control automation decisions.
            </p>
            <div className="mt-4 flex flex-col gap-3">
                {steps.map((step, i) => (
                    <div key={step} className="rounded-2xl bg-slate-950/60 p-4">
                        <span className="mr-3 rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">{i + 1}</span>
                        {step}
                    </div>
                ))}
            </div>
        </section>
    );
}