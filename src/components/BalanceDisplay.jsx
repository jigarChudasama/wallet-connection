import React from 'react';

export default function BalanceDisplay({ isTokenLoading, displayBalance, selectedToken, address }) {
    return (
        <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-70" />

            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Balance</p>

            <div className="flex items-baseline justify-center gap-2 mb-6 transform transition-transform group-hover:scale-[1.02]">
                <h2 className="text-6xl font-extrabold text-white tracking-tight">
                    {isTokenLoading ? (
                        <span className="animate-pulse">...</span>
                    ) : (
                        displayBalance
                    )}
                </h2>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-blue-400">
                    {selectedToken?.symbol}
                </span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-white/5 text-sm font-medium text-gray-300 shadow-sm hover:bg-slate-800 transition-colors cursor-pointer">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '...'}
            </div>
        </div>
    );
}
