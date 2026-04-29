export default function AlertsPanel({alerts}) {
    return (
        <div className="backdrop-blur-xl bg-black/5 p-6 rounded border border-white/40 shadow-inner overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-gray-500 uppercase ">
                    System Intelligence
                </h2>
                {alerts.length > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
            Live
          </span>
                )}
            </div>

            <div className="space-y-3 h-80 overflow-y-auto pr-2 scrollbar-hide">
                {alerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 italic text-sm space-y-2">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                            📡
                        </div>
                        <p>Monitoring Environment...</p>
                    </div>
                ) : (
                    alerts.map((alert, idx) => {
                        const isLatest = idx === 0; // The first item in the array is the newest

                        return (
                            <div
                                key={idx}
                                className={`relative group transition-all duration-300 p-4 rounded border animate-fade-in shadow-sm
                  ${isLatest
                                    ? 'bg-blue-50/60 border-blue-200/50 shadow-blue-200/20'
                                    : 'bg-white/40 border-white/60 hover:bg-white/60'
                                }`}
                            >
                                {/* Facebook-style Blue Dot for the latest notification */}
                                {isLatest && (
                                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"/>
                                )}

                                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isLatest ? 'text-blue-600' : 'text-gray-500'}`}>
                    {alert.time}
                  </span>

                                    <p className={`text-sm leading-snug transition-colors ${isLatest ? 'text-blue-900 font-bold' : 'text-gray-700 font-medium'}`}>
                                        {alert.message}
                                    </p>
                                </div>

                                {/* Subtle hover effect for older notifications */}
                                {!isLatest && (
                                    <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-blue-400/30 rounded-l-2xl transition-all"/>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}