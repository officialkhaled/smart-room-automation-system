export default function CustomProfilePanel({customRuleActive, setCustomRuleActive, addAlert}) {
    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Custom Profiles</h2>
            <div className={`p-4 border rounded transition ${customRuleActive ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-bold text-sm mb-2 text-purple-900">Profile: Strict Efficiency</h4>
                <p className="text-xs text-gray-600 mb-3 italic">"Only turn heating ON if temp is below 20°C AND someone is in the room."</p>
                <button
                    onClick={() => {
                        setCustomRuleActive(!customRuleActive);
                        addAlert(customRuleActive ? "Custom Profile deactivated. Reverted to standard mode." : "Custom Profile activated.");
                    }}
                    className={`cursor-pointer w-full py-2 rounded text-sm font-bold transition ${customRuleActive ? 'bg-purple-600 text-white' : 'bg-orange-200 text-orange-700 hover:bg-orange-300'}`}
                >
                    {customRuleActive ? 'Deactivate Profile' : 'Apply Profile'}
                </button>
            </div>
        </div>
    );
}