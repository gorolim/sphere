"use client";

import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { Shield, Radio, Activity } from "lucide-react";

export default function UnitsPage() {
    return (
        <div className="min-h-screen bg-engine-black text-white relative overflow-hidden">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-12 max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3 text-neon-cyan mb-2">
                        <Shield size={18} />
                        <span className="font-mono text-xs tracking-widest uppercase">Field_Operations</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold">Deployed Units</h1>
                    <p className="text-gray-400 font-mono mt-2">Live monitoring of active PhD-Class agents in the field.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-black/40 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-neon-cyan">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Unit-73{i}</h3>
                                        <div className="text-xs text-green-500 font-mono">ONLINE • OPERATIONAL</div>
                                    </div>
                                </div>
                                <Radio size={16} className="text-green-500 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500 font-mono">
                                    <span>Signal Strength</span>
                                    <span className="text-white">9{i}%</span>
                                </div>
                                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full" style={{ width: `9${i}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
