const GlobalLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-xl">
            <div className="relative flex items-center justify-center">
                {/* Main Glowing Circle */}
                <div className="w-24 h-24 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" />

                {/* Inner Pulsing Core */}
                <div className="absolute w-16 h-16 bg-cyan-500/20 rounded-full animate-pulse blur-sm" />
            </div>

            <div className="mt-6 text-center">
                <h3 className="text-lg font-bold text-white tracking-[0.2em] animate-pulse">
                    LOADING
                </h3>
            </div>
        </div>
    );
};

export default GlobalLoader;
