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

import { TOKEN_LISTS } from "../config/tokens";
import { ERC20_ABI } from "../config/abis";

import Header from "./Header";
import BalanceDisplay from "./BalanceDisplay";
import TransferForm from "./TransferForm";
import Icon from "./Icon";

import { useAppKit } from '@reown/appkit/react'

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, chains } = useSwitchChain();
  const { open } = useAppKit();

  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState("0.001");
  const [recipient, setRecipient] = useState(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  );

  const currentTokens = TOKEN_LISTS[chain?.id] || [];

  useEffect(() => {
    if (currentTokens.length) setSelectedToken(currentTokens[0]);
    else setSelectedToken(null);
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

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -z-10" />

        <div className="glass-card p-12 rounded-3xl max-w-md w-full border-white/10 shadow-2xl flex flex-col items-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-3xl mb-8 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Icon name="lock" className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Crypto Wallet
          </h2>
          <p className="text-gray-400 mb-8 text-lg font-medium leading-relaxed">
            Connect your wallet to manage assets across multiple networks securely.
          </p>
          <button
            onClick={() => open()}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer text-lg border border-white/10"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 relative overflow-hidden transition-colors duration-500">
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="max-w-xl mx-auto space-y-8 relative z-10 animate-fade-in-up">

        <Header
          disconnect={disconnect}
          chains={chains}
          chain={chain}
          switchChain={switchChain}
        />

        <BalanceDisplay
          isTokenLoading={isTokenLoading}
          displayBalance={displayBalance}
          selectedToken={selectedToken}
          address={address}
        />

        <TransferForm
          selectedToken={selectedToken}
          recipient={recipient}
          amount={amount}
          setRecipient={setRecipient}
          setAmount={setAmount}
          handleSend={handleSend}
          isPending={isPending}
          isConfirming={isConfirming}
          txHash={txHash}
          isSuccess={isSuccess}
          currentTokens={currentTokens}
          setSelectedToken={setSelectedToken}
        />

      </div>
    </div>
  );
}
