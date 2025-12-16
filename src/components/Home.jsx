import React, { useState } from "react";
import {
  useAccount,
  useDisconnect,
  useBalance,
  useBlockNumber,
  useSwitchChain,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, chains } = useSwitchChain();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: ethBalance } = useBalance({ address });

  const { data: usdtBalance, isLoading } = useReadContract({
    address: USDT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: isConnected },
  });

  const { sendTransaction, data: txHash, isPending } =
    useSendTransaction();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  const [amount, setAmount] = useState("0.001");

  const handleSendEth = () => {
    sendTransaction({
      to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", //Vitalik Buterin' address 
      value: parseEther(amount),
    });
  };

  /* ---------- DISCONNECTED ---------- */
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="text-3xl font-bold mb-3">
          Crypto Dashboard
        </h2>
        <p className="text-slate-400 mb-6">
          Please connect your wallet to continue
        </p>
        <appkit-button />
      </div>
    );
  }

  /* ---------- CONNECTED ---------- */
  return (
    <div className="min-h-screen bg-slate-950 text-white py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4">

        {/* Wallet Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">👤 My Wallet</h3>
            <button
              onClick={disconnect}
              className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>

          <p className="text-sm text-slate-400 break-all">
            <span className="text-white font-medium">Address:</span>{" "}
            {address}
          </p>

          <p className="mt-2 text-sm">
            <span className="text-slate-400">ETH Balance:</span>{" "}
            {ethBalance?.formatted} {ethBalance?.symbol}
          </p>
        </div>

        {/* Network Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-3">
            🌐 Network Status
          </h3>

          <p className="text-sm">
            <span className="text-slate-400">Chain:</span>{" "}
            {chain?.name} (ID {chain?.id})
          </p>

          <p className="text-sm mt-1">
            <span className="text-slate-400">Block:</span>{" "}
            <span className="text-green-400">
              #{blockNumber?.toString()}
            </span>
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {chains.map((c) => (
              <button
                key={c.id}
                disabled={chain?.id === c.id}
                onClick={() => switchChain({ chainId: c.id })}
                className={`px-3 py-1 rounded-md text-sm border
                  ${
                    chain?.id === c.id
                      ? "bg-slate-800 text-slate-500 border-slate-700"
                      : "bg-slate-800 hover:bg-slate-700 border-slate-600"
                  }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Read Contract */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-3">
            📖 USDT Balance
          </h3>

          {isLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <p>
              <span className="text-slate-400">Balance:</span>{" "}
              {usdtBalance ? formatEther(usdtBalance) : "0"} USDT
            </p>
          )}
        </div>

        {/* Send ETH */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-3">
            💸 Send ETH
          </h3>

          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 outline-none"
            />

            <button
              onClick={handleSendEth}
              disabled={isPending || isConfirming}
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {isPending
                ? "Confirm Wallet"
                : isConfirming
                ? "Processing..."
                : "Send"}
            </button>
          </div>

          {txHash && (
            <div className="mt-4 text-sm break-all">
              <p className="text-slate-400">Tx Hash:</p>
              <p>{txHash}</p>

              {isConfirming && (
                <p className="text-yellow-400 mt-1">
                  ⏳ Waiting for confirmation...
                </p>
              )}

              {isSuccess && (
                <p className="text-green-400 mt-1">
                  ✅ Transaction Successful
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
