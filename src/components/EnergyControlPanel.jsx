export default function EnergyControlPanel({mode, setMode, override, setOverride, resetOverrides, addAlert}) {
    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Energy & Control</h2>

            <div className="mb-4">
                <label className="font-semibold block mb-2">Energy Mode</label>
                <div className="flex gap-2">
                    {['Comfort', 'Eco', 'Away'].map(m => (
                        <button
                            key={m}
                            onClick={() => {
                                setMode(m);
                                addAlert(`Energy mode changed to ${m}`);
                            }}
                            className={`cursor-pointer flex-1 py-1 rounded text-sm font-medium transition ${mode === m ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >{m}</button>
                    ))}
                </div>
            </div>

            <hr className="my-4"/>

            <div>
                <label className="font-semibold block mb-2 justify-between">
                    Manual Overrides
                    {(override.heating !== 'auto' || override.lighting !== 'auto') && (
                        <button onClick={resetOverrides} className="text-xs text-blue-600 hover:underline">Reset to Auto</button>
                    )}
                </label>

                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Force Heating:</span>
                    <select
                        value={override.heating}
                        onChange={(e) => setOverride({...override, heating: e.target.value})}
                        className="cursor-pointer p-1 border rounded text-sm bg-gray-50 border-gray-200"
                    >
                        <option value="auto">Auto</option>
                        <option value="on">Force ON</option>
                        <option value="off">Force OFF</option>
                    </select>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm">Force Lighting:</span>
                    <select
                        value={override.lighting}
                        onChange={(e) => setOverride({...override, lighting: e.target.value})}
                        className="cursor-pointer p-1 border rounded text-sm bg-gray-50 border-gray-200"
                    >
                        <option value="auto">Auto</option>
                        <option value="on">Force ON</option>
                        <option value="off">Force OFF</option>
                    </select>
                </div>
            </div>
        </div>
    );
}