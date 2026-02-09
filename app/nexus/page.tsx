"use client";

import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { Globe, Network } from "lucide-react";

export default function NexusPage() {
    return (
        <div className="min-h-screen bg-engine-black text-white relative overflow-hidden">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-12 max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3 text-neon-cyan mb-2">
                        <Globe size={18} />
                        <span className="font-mono text-xs tracking-widest uppercase">Global_Network</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold">The Nexus</h1>
                    <p className="text-gray-400 font-mono mt-2">Central communication hub and data stream.</p>
                </header>

                <div className="flex flex-col items-center justify-center h-64 border border-white/10 border-dashed rounded-xl bg-white/5">
                    <Network size={48} className="text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold text-gray-400">Stream Disconnected</h2>
                    <p className="text-gray-500 font-mono text-sm mt-2">Awaiting signal from the mainframe.</p>
                </div>
            </main>
        </div>
    );
}
