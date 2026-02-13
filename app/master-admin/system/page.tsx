"use client";

import DashboardPanel from "@/components/ui/DashboardPanel";
import { Cpu, HardDrive, Zap, Thermometer } from "lucide-react";

export default function SystemHealthPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <h1 className="text-3xl font-display font-bold text-white">System Health</h1>
                <span className="text-green-500 font-mono text-sm border border-green-500/30 px-3 py-1 rounded bg-green-500/10">ALL_SYSTEMS_OPERATIONAL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardPanel title="CPU Utilization" subtitle="CORE_DISTRIBUTION" icon={<Cpu size={16} />} className="h-64">
                    <div className="flex gap-2 h-full items-end pb-8 px-4 justify-between">
                        {[40, 65, 30, 85, 50, 60, 45, 70, 90, 55].map((val, i) => (
                            <div key={i} className="w-full bg-white/5 rounded-t relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-neon-cyan transition-all duration-1000 group-hover:bg-white"
                                    style={{ height: `${val}%`, opacity: 0.5 + (val / 200) }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </DashboardPanel>

                <DashboardPanel title="Memory Heap" subtitle="GC_CYCLES" icon={<HardDrive size={16} />} className="h-64">
                    <div className="h-full grid place-items-center">
                        <div className="relative w-32 h-32 rounded-full border-8 border-white/10 grid place-items-center">
                            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#a855f7" strokeWidth="8" strokeDasharray="365" strokeDashoffset="120" strokeLinecap="round" />
                            </svg>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">64%</div>
                                <div className="text-[10px] text-gray-500">USED</div>
                            </div>
                        </div>
                    </div>
                </DashboardPanel>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Search Indexer", "Vector DB", "Auth Service"].map((svc, i) => (
                    <DashboardPanel key={i} title={svc} subtitle="MICROSERVICE" icon={<Zap size={14} />} statusColor="green" className="h-40">
                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Uptime</span>
                                <span className="text-white">99.9%</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Requests</span>
                                <span className="text-white">12k/s</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Latency</span>
                                <span className="text-green-400">12ms</span>
                            </div>
                        </div>
                    </DashboardPanel>
                ))}
            </div>

        </div>
    );
}
