"use client";

import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Activity, Terminal, Zap, CheckCircle, Clock } from "lucide-react";

export default function AutomationPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [activeThreads, setActiveThreads] = useState<number>(12);

    // Simulate live logs
    useEffect(() => {
        const processes = [
            "Optimizing coherence vectors...",
            "Agent LOGIC-001 validating block #9348...",
            "Indexing knowledge base shard...",
            "Garbage collection executed (24ms)",
            "Syncing with Ethereum Mainnet...",
            "Analysing improved ROI vectors...",
            "Agent BIO-001 synthesis complete."
        ];

        const interval = setInterval(() => {
            const randomLog = processes[Math.floor(Math.random() * processes.length)];
            const time = new Date().toLocaleTimeString();
            setLogs(prev => [`[${time}] ${randomLog}`, ...prev].slice(0, 15));
            setActiveThreads(prev => Math.floor(Math.random() * 5) + 10);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-engine-black text-white relative">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-12 max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 text-neon-purple mb-2">
                            <Cpu />
                            <span className="font-mono text-xs tracking-widest uppercase">System_Automation_Core</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold">Process Monitor</h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <div className="text-xs text-gray-500 font-mono">CPU_LOAD</div>
                            <div className="text-2xl font-bold text-neon-cyan">{activeThreads * 3}%</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 font-mono">ACTIVE_THREADS</div>
                            <div className="text-2xl font-bold text-green-500">{activeThreads}</div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Live Log Terminal */}
                    <div className="lg:col-span-2 bg-black/60 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[500px]">
                        <div className="bg-white/5 p-3 border-b border-white/10 flex justify-between items-center">
                            <span className="font-mono text-xs text-gray-400 flex items-center gap-2"><Terminal size={14} /> daemon_log.txt</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-sm space-y-2 overflow-y-auto flex-1 text-green-400/80">
                            <AnimatePresence initial={false}>
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="border-b border-white/5 pb-1"
                                    >
                                        <span className="text-gray-600 mr-2">{">"}</span>
                                        {log}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Visualizer Side Panel */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-2 right-2 animate-pulse">
                                <Activity className="text-neon-cyan" size={20} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neon-cyan mb-4">Automation Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Task Queue</span>
                                    <span className="font-mono text-white">Empty</span>
                                </div>
                                <div className="w-full bg-black h-1 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-neon-cyan/50"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Garbage Coll.</span>
                                    <span className="font-mono text-green-400">Optimal</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Uptime</span>
                                    <span className="font-mono text-white">99.99%</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Tasks */}
                        <div className="bg-engine-dark border border-white/10 rounded-xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" /> Completed Jobs
                            </h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-start gap-3 text-xs">
                                        <Clock size={14} className="text-gray-600 mt-0.5" />
                                        <div>
                                            <div className="text-gray-300">Data Shard Optimization</div>
                                            <div className="text-gray-600 font-mono">134ms • Agent-00{i}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
