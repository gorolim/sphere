
"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import HireModal from "@/components/HireModal";

export default function HireButton({ agent, isHired, isOnline }: { agent: any, isHired: boolean, isOnline: boolean }) {
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    if (!isOnline) {
        return (
            <button
                disabled
                className="w-full mt-8 bg-gray-700/50 text-gray-500 py-3 rounded-xl font-bold border border-gray-600/50 cursor-not-allowed"
            >
                OFFLINE
            </button>
        );
    }

    return (
        <>
            <HireModal
                isOpen={isHireModalOpen}
                onClose={() => setIsHireModalOpen(false)}
                agentName={agent.name}
                agentId={agent.id}
                agentPrice={agent.price}
                agentRole={agent.role}
            />

            {isHired ? (
                <button
                    className="w-full mt-8 bg-green-500/10 text-green-500 py-3 rounded-xl font-bold border border-green-500/50 cursor-default flex items-center justify-center gap-2"
                >
                    <CheckCircle size={20} /> AGENT DEPLOYED
                </button>
            ) : (
                <button
                    onClick={() => setIsHireModalOpen(true)}
                    className="w-full mt-8 bg-white/10 hover:bg-neon-cyan hover:text-black text-white py-3 rounded-xl font-bold transition-all border border-white/10"
                >
                    HIRE AGENT
                </button>
            )}
        </>
    );
}
