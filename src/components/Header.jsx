import React from 'react';

export default function Header({ disconnect, chains, chain, switchChain }) {
    return (
        <div className="glass-card rounded-3xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                        W
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                        WalletConnect
                    </h3>
                </div>

                <button
                    onClick={disconnect}
                    className="px-5 py-2.5 text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
                >
                    Disconnect
                </button>
            </div>

            <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Network</p>
                <div className="flex flex-wrap gap-2">
                    {chains.map((c) => (
                        <button
                            key={c.id}
                            disabled={chain?.id === c.id}
                            onClick={() => switchChain({ chainId: c.id })}
                            className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer
                ${chain?.id === c.id
                                    ? "bg-white text-slate-900 border-white shadow-lg shadow-white/10 scale-105"
                                    : "bg-slate-800/50 text-gray-400 border-transparent hover:bg-slate-700 hover:text-white"
                                }
              `}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
