"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ShieldCheck, Cpu, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { AgentProfile } from "@/lib/brain";
import { useUser } from "@/lib/context/UserContext";

interface CheckoutModalProps {
    agent: AgentProfile;
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckoutModal({ agent, isOpen, onClose }: CheckoutModalProps) {
    const { user, hireAgent } = useUser();
    const [step, setStep] = useState<"review" | "processing" | "success" | "error">("review");
    const [errorMsg, setErrorMsg] = useState("");

    const price = parseInt(agent.price.replace(/\D/g, "")) || 0; // Extract number from string
    const gasFee = Math.floor(price * 0.02); // 2% Simulate Gas
    const total = price + gasFee;

    const handleConfirm = () => {
        if (user.balance < total) {
            setStep("error");
            setErrorMsg("Insufficient Neural Credits (NCR). Please top up your wallet.");
            return;
        }

        setStep("processing");

        // Simulate Network Delay
        setTimeout(() => {
            const success = hireAgent(agent, total);
            if (success) {
                setStep("success");
            } else {
                setStep("error");
                setErrorMsg("Transaction failed. Smart Contract rejected the signature.");
            }
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-[#0a0a12] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    {/* Header */}
                    <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
                        <h3 className="font-display font-bold flex items-center gap-2">
                            <ShieldCheck size={18} className="text-neon-cyan" />
                            SECURE CHECKOUT
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {step === "review" && (
                            <>
                                <div className="flex gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-2xl font-bold text-gray-500">
                                        {agent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{agent.name}</h4>
                                        <p className="text-sm text-gray-400 font-mono">{agent.role}</p>
                                        <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan text-[10px] font-mono border border-neon-cyan/20">
                                            VERIFIED_CONTRACT
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded-lg p-4 space-y-3 font-mono text-sm mb-6 border border-white/5">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{price.toLocaleString()} NCR</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Network Fee (Gas)</span>
                                        <span>{gasFee.toLocaleString()} NCR</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex justify-between text-white font-bold text-base">
                                        <span>TOTAL</span>
                                        <span>{total.toLocaleString()} NCR</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    className="w-full bg-neon-cyan/10 hover:bg-neon-cyan hover:text-black text-neon-cyan border border-neon-cyan/50 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Wallet size={18} /> CONFIRM TRANSACTION
                                </button>
                            </>
                        )}

                        {step === "processing" && (
                            <div className="text-center py-8">
                                <div className="relative w-16 h-16 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-neon-cyan/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-neon-cyan rounded-full animate-spin"></div>
                                    <Cpu className="absolute inset-0 m-auto text-neon-cyan animate-pulse" size={24} />
                                </div>
                                <h4 className="font-bold text-white mb-2">Processing on Chain...</h4>
                                <p className="text-sm text-gray-400 font-mono">Verifying smart contract signature.</p>
                            </div>
                        )}

                        {step === "success" && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <h4 className="font-bold text-white mb-2">Acquisition Complete!</h4>
                                <p className="text-sm text-gray-400 font-mono mb-6">Agent has been deployed to your fleet.</p>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all"
                                >
                                    Access Agent
                                </button>
                            </div>
                        )}

                        {step === "error" && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
                                    <AlertCircle size={32} className="text-red-500" />
                                </div>
                                <h4 className="font-bold text-white mb-2">Transaction Failed</h4>
                                <p className="text-sm text-red-400 font-mono mb-6">{errorMsg}</p>
                                <button
                                    onClick={() => setStep("review")}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
