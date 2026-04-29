export default function DashboardHeader() {
    return (
        <header className="backdrop-blur-md bg-white p-6 rounded border border-white/50 shadow-sm flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">RoomSense - Smart Room Automation System</h1>
                <p className="text-gray-600 font-medium">Control Center</p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Active</span>
            </div>
        </header>
    );
}