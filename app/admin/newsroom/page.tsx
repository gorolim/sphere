"use client";

import { useState } from "react";
import { Terminal, Instagram, Youtube, Play, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsroomPage() {
    const [journalistStatus, setJournalistStatus] = useState("idle");
    const [socialStatus, setSocialStatus] = useState("waiting");

    const [logs, setLogs] = useState([
        "[SYSTEM] Newsroom Uplink Established.",
        "[JOURNALIST] Waiting for daily trigger..."
    ]);

    const runDailyCycle = () => {
        setJournalistStatus("writing");
        setLogs(prev => [...prev, ">> [JOURNALIST] Scanning Platform Metrics...", ">> [JOURNALIST] Drafting 'Daily Digest'...", ">> [JOURNALIST] Analyzing Top Sellers..."]);

        setTimeout(() => {
            setJournalistStatus("published");
            setSocialStatus("processing");
            setLogs(prev => [...prev, ">> [JOURNALIST] Article Published: 'Sphere Chronicles #402'", ">> [EVENT_BUS] Triggering Social Swarm..."]);

            setTimeout(() => {
                setLogs(prev => [...prev, ">> [INSTAGRAM_AGENT] Generative Image: 'Cyber-Skull Product' (Nano Banana)", ">> [YOUTUBE_AGENT] Generative Video: 'Market Recap' (Veo)"]);
                setSocialStatus("completed");
                setLogs(prev => [...prev, ">> [SYSTEM] Daily Content Cycle Completed."]);
            }, 2500);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold">The Newsroom</h1>
                <button
                    onClick={runDailyCycle}
                    disabled={journalistStatus !== "idle"}
                    className="flex items-center gap-2 bg-neon-cyan text-black px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                >
                    <Play size={18} /> {journalistStatus === "idle" ? "RUN DAILY CYCLE" : "CYCLE RUNNING..."}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* The Journalist */}
                <motion.div
                    animate={journalistStatus === "writing" ? { borderColor: "#00f3ff", boxShadow: "0 0 20px rgba(0,243,255,0.2)" } : {}}
                    className="bg-engine-dark border border-white/10 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                            <Terminal size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold">The Journalist</h3>
                            <p className="text-xs text-gray-400">SEO/AEO Specialist</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className={journalistStatus === "writing" ? "text-neon-cyan animate-pulse" : "text-white"}>{journalistStatus.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Last Article</span>
                            <span className="text-white">Yesterday</span>
                        </div>
                    </div>
                </motion.div>

                {/* Instagram Agent */}
                <motion.div
                    animate={socialStatus === "processing" ? { borderColor: "#bd00ff", boxShadow: "0 0 20px rgba(189,0,255,0.2)" } : {}}
                    className="bg-engine-dark border border-white/10 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                            <Instagram size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold">Social Manager (IG)</h3>
                            <p className="text-xs text-gray-400">Visuals (Nano Banana)</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Trigger</span>
                            <span className="text-white">On Blog Post</span>
                        </div>
                        {socialStatus === "completed" && <div className="text-green-500 text-xs mt-2 flex items-center gap-1"><CheckCircle size={12} /> POST_SCHEDULED</div>}
                    </div>
                </motion.div>

                {/* YouTube Agent */}
                <motion.div
                    animate={socialStatus === "processing" ? { borderColor: "#ff0000", boxShadow: "0 0 20px rgba(255,0,0,0.2)" } : {}}
                    className="bg-engine-dark border border-white/10 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                            <Youtube size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold">Social Manager (YT)</h3>
                            <p className="text-xs text-gray-400">Video (Veo)</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Trigger</span>
                            <span className="text-white">On Blog Post</span>
                        </div>
                        {socialStatus === "completed" && <div className="text-green-500 text-xs mt-2 flex items-center gap-1"><CheckCircle size={12} /> CLIP_RENDERED</div>}
                    </div>
                </motion.div>

            </div>

            {/* Live Feed */}
            <div className="bg-black border border-white/10 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm text-green-500 leading-relaxed shadow-inner">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                ))}
            </div>
        </div>
    );
}
