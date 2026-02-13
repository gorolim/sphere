"use client";

import DashboardPanel from "@/components/ui/DashboardPanel";
import { Globe, Wifi, Server, Database } from "lucide-react";

export default function GlobalIntelPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-white mb-8">Global Intelligence</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardPanel title="Active Nodes" subtitle="GLOBAL_RELAYS" icon={<Globe size={16} />} className="h-32">
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">4,291</span>
                        <span className="text-xs text-green-500 font-mono">▲ +12%</span>
                    </div>
                </DashboardPanel>
                <DashboardPanel title="Network Latency" subtitle="AVG_PING" icon={<Wifi size={16} />} statusColor="yellow" className="h-32">
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">24ms</span>
                        <span className="text-xs text-gray-500 font-mono">Stable</span>
                    </div>
                </DashboardPanel>
                <DashboardPanel title="Data Ingest" subtitle="TB_PER_HOUR" icon={<Database size={16} />} statusColor="blue" className="h-32">
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">1.8</span>
                        <span className="text-xs text-neon-cyan font-mono">TB/h</span>
                    </div>
                </DashboardPanel>
                <DashboardPanel title="Compute Load" subtitle="CLUSTER_USAGE" icon={<Server size={16} />} statusColor="green" className="h-32">
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">78%</span>
                        <span className="text-xs text-yellow-500 font-mono">Heavy</span>
                    </div>
                </DashboardPanel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardPanel title="Live Threat Map" subtitle="VECTOR_ANALYSIS" className="lg:col-span-2 h-[500px]">
                    <div className="w-full h-full bg-[#050510] relative grid place-items-center overflow-hidden rounded-lg">
                        {/* Placeholder for complex map - using CSS radial for effect */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at center, #222 0%, #000 70%)" }}></div>
                        <div className="w-64 h-64 border border-neon-cyan/30 rounded-full animate-[spin_10s_linear_infinite] border-dashed"></div>
                        <div className="w-48 h-48 border border-neon-purple/30 rounded-full animate-[spin_5s_linear_infinite_reverse] absolute"></div>
                        <div className="absolute text-xs font-mono text-neon-cyan/50">SCANNING_GLOBAL_NETWORKS...</div>
                    </div>
                </DashboardPanel>

                <DashboardPanel title="Ingest Sources" subtitle="API_GATEWAYS" className="h-[500px]">
                    <div className="space-y-4 p-2">
                        {["Twitter Firehose", "Bloomberg Terminal", "Weather API", "GitHub Events", "NASA NeoWs"].map((src, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                                <span className="text-sm text-gray-300">{src}</span>
                                <div className="flex gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardPanel>
            </div>
        </div>
    );
}
