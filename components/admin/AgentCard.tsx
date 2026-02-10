
"use client";

import { Bot, Activity, Settings, Power } from "lucide-react";
import { useState } from "react";
import { toggleAgentStatus } from "@/app/actions/agent";

interface Agent {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
    description: string | null;
}

export default function AgentCard({ agent }: { agent: Agent }) {
    const [isActive, setIsActive] = useState(agent.isActive);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        const newState = !isActive;
        setIsActive(newState); // Optimistic

        try {
            await toggleAgentStatus(agent.id, isActive);
        } catch (e) {
            console.error("Failed to toggle agent", e);
            setIsActive(!newState); // Revert
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`bg-engine-dark border ${isActive ? 'border-neon-cyan/50 shadow-[0_0_20px_rgba(0,243,255,0.1)]' : 'border-white/10'} rounded-xl p-6 transition-all group relative overflow-hidden`}>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot size={64} />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors ${isActive ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                    <Bot size={24} />
                </div>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 border transition-all ${isActive
                            ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                        }`}
                >
                    <Power size={10} /> {isActive ? 'ONLINE' : 'OFFLINE'}
                </button>
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                <p className="text-sm text-gray-500 font-mono mb-4">{agent.role}</p>

                <div className="h-12">
                    <p className="text-xs text-gray-400 line-clamp-2">{agent.description || "No description provided."}</p>
                </div>

                <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all">
                        <Settings size={14} /> CONFIGURE
                    </button>
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all">
                        <Activity size={14} /> LOGS
                    </button>
                </div>
            </div>
        </div>
    );
}
