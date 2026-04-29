export default function LogPanel({logs}) {
    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Trigger Logs</h2>
            <div className="mt-4 space-y-2">
                {logs.map((log, i) => (
                    <div key={i} className="rounded-2xl bg-slate-950/60 p-3 text-sm text-slate-300">
                        {log}
                    </div>
                ))}
            </div>
        </section>
    );
}