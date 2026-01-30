import React from 'react';
import TokenSelector from './TokenSelector';
import Icon from './Icon';

export default function TransferForm({
    selectedToken,
    recipient,
    amount,
    setRecipient,
    setAmount,
    handleSend,
    isPending,
    isConfirming,
    txHash,
    isSuccess,
    currentTokens,
    setSelectedToken
}) {
    return (
        <div className="glass-card rounded-3xl p-8 mt-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="send" className="w-8 h-8 text-cyan-500" />
                <span>Send Crypto</span>
            </h3>

            <TokenSelector
                selectedToken={selectedToken}
                currentTokens={currentTokens}
                onSelect={setSelectedToken}
            />

            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Recipient Address</label>
                    <input
                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all shadow-inner"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x0000..."
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Amount</label>
                    <div className="relative">
                        <input
                            type="number"
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-3xl font-bold text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all shadow-inner"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                            {selectedToken?.symbol}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSend}
                disabled={isPending || isConfirming || !amount || !recipient}
                className={`w-full mt-8 py-5 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2
          ${isPending || isConfirming || !amount || !recipient
                        ? "bg-slate-700 text-gray-500 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/30"
                    }`}
            >
                {isPending
                    ? "Confirming in Wallet..."
                    : isConfirming
                        ? "Processing Transaction..."
                        : "Send Now"}
            </button>

            {txHash && (
                <div className={`mt-6 p-4 rounded-xl text-sm border ${isSuccess
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                        <Icon name={isSuccess ? "check" : "clock"} className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wide text-xs">
                            {isSuccess ? "Transaction Successful" : "Transaction Pending"}
                        </span>
                    </div>
                    <p className="font-mono text-xs break-all opacity-80 pl-8">{txHash}</p>
                </div>
            )}
        </div>
    );
}
