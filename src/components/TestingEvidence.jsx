import React from "react";

const rows = [
    {input: "16°C, Occupancy Present", expected: "Lights ON, Heating ON", actual: "Lights ON, Heating ON", result: "Pass"},
    {input: "22°C, Occupancy Not Present", expected: "Lights OFF, Heating OFF", actual: "Lights OFF, Heating OFF", result: "Pass"},
    {input: "17°C, Away Mode", expected: "Lights OFF, Heating ON or reduced heating", actual: "Lights OFF, Heating ON", result: "Pass"},
];

export default function TestingEvidence() {
    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Testing Evidence</h2>
            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-400">
                    <tr>
                        <th className="py-3">Input condition</th>
                        <th className="py-3">Expected output</th>
                        <th className="py-3">Actual output</th>
                        <th className="py-3">Pass/Fail</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-slate-800">
                            <td className="py-3">{row.input}</td>
                            <td className="py-3">{row.expected}</td>
                            <td className="py-3">{row.actual}</td>
                            <td className="py-3 text-emerald-300">{row.result}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}