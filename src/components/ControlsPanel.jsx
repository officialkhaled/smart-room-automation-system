export default function ControlsPanel({temperature, setTemperature, occupancy, setOccupancy}) {
    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Sensor Inputs</h2>

            <div className="mb-6">
                <label className="flex justify-between font-semibold mb-2">
                    Temperature <span>{temperature}°C</span>
                </label>
                <input
                    type="range" min="10" max="30" value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full cursor-pointer accent-blue-600"
                />
            </div>

            <div>
                <label className="font-semibold block mb-2">Occupancy</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setOccupancy(true)}
                        className={`cursor-pointer flex-1 py-2 rounded font-medium transition ${occupancy ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        Present
                    </button>
                    <button
                        onClick={() => setOccupancy(false)}
                        className={`cursor-pointer flex-1 py-2 rounded font-medium transition ${!occupancy ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        Not Present
                    </button>
                </div>
            </div>
        </div>
    );
}