import React, { useState, useEffect } from "react";
import {
  useAccount,
  useDisconnect,
  useBalance,
  useSwitchChain,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseEther, parseUnits, formatUnits } from "viem";

/* ---------------- ERC20 ABI ---------------- */
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

/* ---------------- Token Config ---------------- */
const TOKEN_LISTS = {
  1: [
    { symbol: "ETH", name: "Ethereum", isNative: true, decimals: 18 },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
  ],
  11155111: [
    { symbol: "SepoliaETH", name: "Sepolia Ether", isNative: true, decimals: 18 },
    {
      symbol: "USDC",
      name: "USDC Test",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimals: 6,
    },
  ],
  56: [
    { symbol: "BNB", name: "Binance Coin", isNative: true, decimals: 18 },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
    },
  ],
};

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, chains } = useSwitchChain();

  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState("0.001");
  const [recipient, setRecipient] = useState(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  );

  const currentTokens = TOKEN_LISTS[chain?.id] || [];

  useEffect(() => {
    if (currentTokens.length) setSelectedToken(currentTokens[0]);
  }, [chain?.id]);

  /* ---------------- Balances ---------------- */
  const { data: nativeBalance } = useBalance({
    address,
    query: { enabled: isConnected && selectedToken?.isNative },
  });

  const { data: tokenBalance, isLoading: isTokenLoading } = useReadContract({
    address: selectedToken?.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: isConnected && !selectedToken?.isNative },
  });

  const displayBalance = selectedToken?.isNative
    ? nativeBalance?.formatted
    : tokenBalance
    ? formatUnits(tokenBalance, selectedToken.decimals)
    : "0";

  /* ---------------- Transactions ---------------- */
  const { sendTransaction, data: ethTxHash, isPending: isEthPending } =
    useSendTransaction();
  const {
    writeContract,
    data: tokenTxHash,
    isPending: isTokenPending,
  } = useWriteContract();

  const txHash = ethTxHash || tokenTxHash;
  const isPending = isEthPending || isTokenPending;
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  const handleSend = () => {
    if (!selectedToken || !amount) return;

    if (selectedToken.isNative) {
      sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
    } else {
      writeContract({
        address: selectedToken.address,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [recipient, parseUnits(amount, selectedToken.decimals)],
      });
    }
  };

  /* ---------------- UI ---------------- */
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Crypto Dashboard
        </h2>
        <p className="text-gray-500 mb-6">
          Connect your wallet to continue
        </p>
        <appkit-button />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4">
        {/* Configuration */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              ⚙️ Configuration
            </h3>
            <button
              onClick={disconnect}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
            >
              Disconnect
            </button>
          </div>

          <p className="text-xs text-gray-500 font-semibold mb-2">NETWORK</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {chains.map((c) => (
              <button
                key={c.id}
                disabled={chain?.id === c.id}
                onClick={() => switchChain({ chainId: c.id })}
                className={`px-4 py-2 rounded-xl text-sm border transition
                  ${
                    chain?.id === c.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 font-semibold mb-2">TOKEN</p>
          <select
            className="w-full bg-white border border-gray-300 rounded-xl p-3"
            value={selectedToken?.symbol}
            onChange={(e) =>
              setSelectedToken(
                currentTokens.find((t) => t.symbol === e.target.value)
              )
            }
          >
            {currentTokens.map((t) => (
              <option key={t.symbol} value={t.symbol}>
                {t.symbol} - {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Balance */}
        <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center shadow">
          <p className="text-gray-500 mb-2">Available Balance</p>
          <h2 className="text-5xl font-extrabold text-gray-900">
            {isTokenLoading ? "..." : displayBalance}
            <span className="text-blue-600 text-2xl ml-2">
              {selectedToken?.symbol}
            </span>
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-xs text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>

        {/* Send */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">
            💸 Send {selectedToken?.symbol}
          </h3>

          <input
            className="w-full mb-3 px-4 py-3 border rounded-xl"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <input
            type="number"
            className="w-full mb-4 px-4 py-3 border rounded-xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleSend}
            disabled={isPending || isConfirming}
            className={`w-full py-4 rounded-xl font-semibold text-lg
              ${
                isPending || isConfirming
                  ? "bg-gray-300 text-gray-500"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
          >
            {isPending
              ? "Confirm in Wallet..."
              : isConfirming
              ? "Processing..."
              : "Send"}
          </button>

          {txHash && (
            <div className="mt-4 text-xs text-gray-500 break-all">
              <span className="font-semibold">
                {isSuccess ? "Confirmed" : "Pending"}:
              </span>{" "}
              {txHash}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
