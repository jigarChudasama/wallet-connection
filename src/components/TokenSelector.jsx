import React from 'react';
import Icon from './Icon';

export default function TokenSelector({ selectedToken, currentTokens, onSelect }) {
    if (!currentTokens || currentTokens.length <= 1) {
        return null;
    }

    return (
        <div className="mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Select Asset</label>
            <div className="relative">
                <select
                    className="w-full appearance-none bg-slate-800/50 border border-white/10 rounded-2xl p-4 pr-10 text-white font-semibold text-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-lg hover:bg-slate-800 hover:border-white/20"
                    value={selectedToken?.symbol || ''}
                    onChange={(e) => {
                        const token = currentTokens.find((t) => t.symbol === e.target.value);
                        onSelect(token);
                    }}
                >
                    {currentTokens.map((t) => (
                        <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                            {t.symbol} - {t.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <Icon name="chevronDown" className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
