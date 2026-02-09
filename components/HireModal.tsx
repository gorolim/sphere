"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Shield } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { AgentProfile } from "@/lib/brain";

interface HireModalProps {
    isOpen: boolean;
    onClose: () => void;
    agentName: string;
    agentPrice: string;
    agentId: string;
    agentRole: string; // Added to pass to CheckoutModal
}

export default function HireModal({ isOpen, onClose, agentName, agentPrice, agentId, agentRole }: HireModalProps) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Construct a temporary agent object for the CheckoutModal
    const tempAgent: AgentProfile = {
        id: agentId,
        name: agentName,
        role: agentRole,
        price: agentPrice,
        field: "Unknown", // Placeholder as this modal doesn't have full context
        description: "",
        capabilities: [],
        specs: { specialization: "", mission: "", manifestation: "" },
        hardware: [], visual_theme: { color: "", icon: "" }
    };

    const handleDeploy = () => {
        setIsCheckoutOpen(true);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && !isCheckoutOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                        >
                            <div className="bg-engine-dark border border-white/10 w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.1)] overflow-hidden pointer-events-auto relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="bg-white/5 p-6 border-b border-white/10">
                                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                        <Cpu className="text-neon-cyan" size={20} />
                                        Initialise Contract
                                    </h2>
                                    <p className="text-xs font-mono text-neon-purple mt-1">
                                        TARGET: {agentId}
                                    </p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-2">MISSION_OBJECTIVE</label>
                                        <textarea
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-neon-cyan focus:outline-none min-h-[100px]"
                                            placeholder="Describe the task parameters..."
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 mb-2">RATE</label>
                                            <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white">
                                                {agentPrice}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 mb-2">PRIORITY</label>
                                            <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-neon-cyan focus:outline-none">
                                                <option>Standard</option>
                                                <option>High Velocity</option>
                                                <option>Critical (Max Gas)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={handleDeploy}
                                            className="w-full bg-neon-cyan text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Shield size={18} /> DEPLOY SMART CONTRACT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CheckoutModal
                agent={tempAgent}
                isOpen={isCheckoutOpen}
                onClose={() => {
                    setIsCheckoutOpen(false);
                    onClose();
                }}
            />
        </>
    );
}
