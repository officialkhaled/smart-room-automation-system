export default function DemoPanel() {
    return (
        <div className="bg-blue-50/20 backdrop-blur-xl p-6 rounded shadow-sm border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-2">🎬 Demo Guide</h2>
            <ul className="text-sm text-blue-800 space-y-2 list-disc pl-5">
                <li><strong>TC1/TC2:</strong> Lower temp below 18°C. See heating turn ON.</li>
                <li><strong>TC3:</strong> Toggle Occupancy to see lights react.</li>
                <li><strong>TC4:</strong> Change Mode to 'Away' (10°C limit). Watch heating shut off.</li>
                <li><strong>TC5:</strong> Use manual override below. Check alerts.</li>
                <li><strong>TC6:</strong> Enable Custom Profile in rules card.</li>
            </ul>
        </div>
    );
}