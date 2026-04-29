export default function StatusCards({heating, lighting, override}) {
    const cardStyle = "backdrop-blur-xl p-8 rounded border border-white/60 shadow-lg transition-all duration-500 flex flex-col items-center justify-center";

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className={`${cardStyle} ${heating ? 'bg-orange-500/20 border-orange-300 scale-107' : 'bg-white'}`}>
                <div className={`text-5xl mb-4 transition-transform duration-500 ${heating ? 'scale-125' : ''}`}>🌡️</div>
                <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Heating</h3>
                <p className={`text-2xl font-black ${heating ? 'text-orange-600' : 'text-gray-400'}`}>{heating ? 'ON' : 'OFF'}</p>
                {override.heating !== 'auto' && <span className="mt-2 px-2 py-0.5 bg-red-500/10 text-red-600 text-[10px] font-bold rounded-full border border-red-500/20">MANUAL</span>}
            </div>

            <div className={`${cardStyle} ${lighting ? 'bg-yellow-400/20 border-yellow-300 scale-105' : 'bg-white'}`}>
                <div className={`text-5xl mb-4 transition-transform duration-500 ${lighting ? 'scale-125' : ''}`}>💡</div>
                <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Lighting</h3>
                <p className={`text-2xl font-black ${lighting ? 'text-yellow-600' : 'text-gray-400'}`}>{lighting ? 'ON' : 'OFF'}</p>
                {override.lighting !== 'auto' && <span className="mt-2 px-2 py-0.5 bg-red-500/10 text-red-600 text-[10px] font-bold rounded-full border border-red-500/20">MANUAL</span>}
            </div>
        </div>
    );
}