"use client";

import { useState, useEffect } from "react";
import { Activity, Database, Cpu, Webhook, HardDrive, CheckCircle2, AlertTriangle } from "lucide-react";

export function SystemPulse() {
    // Mock health states
    const [skeletonHealth, setSkeletonHealth] = useState("STEADY");
    const [cortexHealth, setCortexHealth] = useState("AWAKE");
    const [synapseHealth, setSynapseHealth] = useState("ROUTING");
    const [vaultHealth, setVaultHealth] = useState("SECURE");

    // Simulate occasional synapse fluctuations for realism
    useEffect(() => {
        const interval = setInterval(() => {
            const chance = Math.random();
            if (chance > 0.9) setSynapseHealth("FLUCTUATING");
            else if (chance > 0.8) setCortexHealth("PROCESSING");
            else {
                setSynapseHealth("ROUTING");
                setCortexHealth("AWAKE");
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-engine-background border border-white/10 rounded-xl p-6 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
                 <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md animate-pulse"></div>
                    <div className="relative p-3 rounded-full bg-black/50 text-green-500 border border-green-500/30">
                        <Activity size={24} />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">
                        The Pulse
                    </h2>
                    <p className="text-sm font-mono text-gray-400">Bio-Mechanical System Vitals</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* The Skeleton (Database) */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Database size={16} className="text-gray-400" />
                        {skeletonHealth === "STEADY" ? (
                            <span className="text-green-500 animate-pulse"><CheckCircle2 size={14}/></span>
                        ) : (
                            <span className="text-yellow-500"><AlertTriangle size={14}/></span>
                        )}
                    </div>
                    <h3 className="font-bold text-white text-sm">The Skeleton</h3>
                    <p className="text-xs font-mono text-gray-500 mb-2">Prisma ORM Structure</p>
                    <p className={`text-xs font-mono font-bold ${skeletonHealth === "STEADY" ? "text-green-400" : "text-yellow-500"}`}>
                        [{skeletonHealth}]
                    </p>
                </div>

                {/* The Synapses (API/Webhooks) */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-lg relative overflow-hidden">
                    {synapseHealth === "FLUCTUATING" && (
                        <div className="absolute top-0 right-0 w-full h-1 bg-yellow-500/50 animate-pulse"></div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                        <Webhook size={16} className="text-gray-400" />
                        {synapseHealth === "ROUTING" ? (
                            <span className="text-green-500 animate-pulse"><CheckCircle2 size={14}/></span>
                        ) : (
                            <span className="text-yellow-500"><Activity size={14} className="animate-spin"/></span>
                        )}
                    </div>
                    <h3 className="font-bold text-white text-sm">The Synapses</h3>
                    <p className="text-xs font-mono text-gray-500 mb-2">API Route Connections</p>
                    <p className={`text-xs font-mono font-bold ${synapseHealth === "ROUTING" ? "text-green-400" : "text-yellow-500"}`}>
                        [{synapseHealth}]
                    </p>
                </div>

                {/* The Cortex (Agents) */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Cpu size={16} className="text-gray-400" />
                        <span className="text-neon-cyan animate-pulse"><CheckCircle2 size={14}/></span>
                    </div>
                    <h3 className="font-bold text-white text-sm">The Cortex</h3>
                    <p className="text-xs font-mono text-gray-500 mb-2">LLM Cognitive Engines</p>
                    <p className="text-xs font-mono font-bold text-neon-cyan">
                        [{cortexHealth}]
                    </p>
                </div>

                {/* The Vault (Storage) */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <HardDrive size={16} className="text-gray-400" />
                        <span className="text-green-500 animate-pulse"><CheckCircle2 size={14}/></span>
                    </div>
                    <h3 className="font-bold text-white text-sm">The Vault</h3>
                    <p className="text-xs font-mono text-gray-500 mb-2">Deep Memory / Postgres</p>
                    <p className="text-xs font-mono font-bold text-green-400">
                        [{vaultHealth}]
                    </p>
                </div>

            </div>
        </div>
    );
}
