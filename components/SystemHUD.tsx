"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/context/UserContext";

export default function SystemHUD() {
    const { user } = useUser();
    const [time, setTime] = useState("");
    const [latency, setLatency] = useState(12);

    useEffect(() => {
        // Update time
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);

        // Simulate network latency fluctuation
        const netTimer = setInterval(() => {
            setLatency(Math.floor(Math.random() * (45 - 8 + 1) + 8));
        }, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(netTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-4 font-mono text-[10px] md:text-xs text-neon-cyan/60 uppercase tracking-widest select-none">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <div className="border border-neon-cyan/30 px-2 py-1 bg-black/50 backdrop-blur-sm">
                        SYS: ONLINE
                    </div>
                    <div className="border border-neon-cyan/30 px-2 py-1 bg-black/50 backdrop-blur-sm hidden md:block">
                        NET: {latency}ms
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="border border-neon-cyan/30 px-2 py-1 bg-black/50 backdrop-blur-sm">
                        {time || "00:00:00"} // UTC
                    </div>
                    <div className="flex gap-2 mt-1">
                        <div className="border border-neon-cyan/20 px-1.5 py-0.5 text-[8px] bg-neon-cyan/5">
                            CR: {user.balance.toLocaleString()}
                        </div>
                        <div className="text-[8px] opacity-70">
                            ID: {user.isLoggedIn ? user.name.toUpperCase() : "GUEST"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Crosshairs / Decorative Elements */}
            <div className="absolute top-1/2 left-4 w-2 h-2 border-l border-t border-neon-cyan/50"></div>
            <div className="absolute top-1/2 right-4 w-2 h-2 border-r border-t border-neon-cyan/50"></div>
            <div className="absolute bottom-1/2 left-4 w-2 h-2 border-l border-b border-neon-cyan/50"></div>
            <div className="absolute bottom-1/2 right-4 w-2 h-2 border-r border-b border-neon-cyan/50"></div>

            {/* Bottom Bar / Terminal Log */}
            <div className="flex justify-between items-end">
                <div className="w-64 h-24 overflow-hidden mask-image-gradient hidden md:block">
                    <TerminalLog />
                </div>

                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-neon-cyan/50 animate-pulse"></div>
                    <div className="w-2 h-2 bg-neon-cyan/30"></div>
                    <div className="w-2 h-2 bg-neon-cyan/10"></div>
                </div>
            </div>
        </div>
    );
}

function TerminalLog() {
    const [logs, setLogs] = useState<string[]>([
        "System Initialized...",
        "Connecting to Neural Net...",
        "Agents: 16/16 Online",
    ]);

    useEffect(() => {
        const messages = [
            "Packet received from AGT-004",
            "Optimizing render queue...",
            "Ping: 12ms",
            "Garbage collection verified.",
            "User session established.",
            "Syncing distributed ledger...",
            "Frame buffer cleared.",
            "Security handshake: OK"
        ];

        const interval = setInterval(() => {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
            setLogs(prev => [...prev.slice(-4), `[${timestamp}] ${msg}`]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-end h-full text-neon-cyan/50 text-[10px]">
            {logs.map((log, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                >
                    &gt; {log}
                </motion.div>
            ))}
        </div>
    );
}
