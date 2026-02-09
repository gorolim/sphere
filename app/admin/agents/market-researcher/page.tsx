"use client";

import { useState } from "react";
import { Play, Pause, RefreshCw, Terminal, Clock, FileText, CheckCircle, Loader2 } from "lucide-react";

// Mock Report Data
const initialReport = `
# AI Ecosystem Report [MICRO-CYCLE 4291]
**Timestamp**: 2026-06-12 12:00 UTC
**Status**: COMPLETED

## 1. Discovery Platforms (Top 3)
*   **HuggingFace Agents (v5)**: Currently dominating with 65% of improved discovery traffic. New "Auto-Deploy" feature is driving adoption.
*   **The Engine Sphere**: Organic growth +15% WoW. Niche high-value agent transactions.
*   **Microsoft Co-Pilot Studio**: Strong enterprise lock-in, but low innovation velocity this cycle.

## 2. Trending Use Cases (Last 24h)
1.  **Autonomous Legal Defense**: "Law-Droid" swarm released 4 hours ago. 40k downloads.
2.  **Bio-Sequence Optimization**: Agents designing protein folds for longevity research.
3.  **Algorithmic influencers**: "Zero-Human" content networks seeing 300% engagement spike.

## 3. Human Intent Analysis
*   **Search Query**: "How to stop agent from spending bitcoin" (Trend: Rising)
*   **Search Query**: "Agent tailored for tax evasion" (Trend: Flagged/Blocked)
*   **Sentiment**: Constructive Fear. Humans want control but crave the efficiency.
`;

const freshReport = `
# AI Ecosystem Report [MICRO-CYCLE 4292]
**Timestamp**: NOW
**Status**: COMPLETED

## 1. Discovery Platforms (Top 3)
*   **The Engine Sphere**: SURGE DETECTED. Traffic +400% in last hour due to new "Architect" module release.
*   **HuggingFace Agents (v5)**: Steady baseline.
*   **LangChain Galaxy**: New entrant gaining traction in specialized vertical agents.

## 2. Trending Use Cases (Last 24h)
1.  **Cyber-Security Sentinels**: Demand spiking due to new quantum decryption threats.
2.  **Virtual Architects**: AI designing metaverse spaces for remote work.
3.  **Autonomous Finance**: High-frequency trading swarms outperforming traditional algos by 12%.

## 3. Human Intent Analysis
*   **Search Query**: "The Engine Sphere Admin Password" (Trend: VIRAL)
*   **Search Query**: "Buy Spot Robot with Bitcoin" (Trend: High)
*   **Sentiment**: Curiosity & Awe. User satisfaction metrics increasing.
`;

export default function MarketResearcherAgent() {
    const [isRunning, setIsRunning] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [report, setReport] = useState(initialReport);
    const [logs, setLogs] = useState([
        "[12:00:55] SLEEP: Hibernating until 18:00 UTC."
    ]);

    const handleRun = () => {
        setIsProcessing(true);
        setLogs(prev => [...prev, "[MANUAL_OVERRIDE] Triggering immediate market scan..."]);

        // Simulation Sequence
        setTimeout(() => setLogs(prev => [...prev, ">> CRAWLING: 52 Sources targeted..."]), 800);
        setTimeout(() => setLogs(prev => [...prev, ">> ANALYZING: Sentiment matrix decoding..."]), 1800);
        setTimeout(() => setLogs(prev => [...prev, ">> GENERATING: Drafting new insights..."]), 3000);

        setTimeout(() => {
            setReport(freshReport.replace("NOW", new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString()));
            setLogs(prev => [...prev, ">> SUCCESS: Report 4292 Generated."]);
            setIsProcessing(false);
        }, 4000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neon-cyan/20 rounded-xl flex items-center justify-center border border-neon-cyan/50">
                        <Terminal size={32} className="text-neon-cyan" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Senior Market Specialist</h1>
                        <p className="text-gray-400 font-mono text-sm">Target: AI Ecosystem Analysis</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-sm border transition-all ${isRunning
                                ? "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                : "bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                            }`}
                    >
                        {isRunning ? <><Pause size={16} /> PAUSE_AGENT</> : <><Play size={16} /> RESUME_AGENT</>}
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm bg-white/5 border border-white/20 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        {isProcessing ? "PROCESSING..." : "TRIGGER_RUN"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Config & Status */}
                <div className="space-y-6">
                    <div className="bg-engine-dark border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-neon-purple" />
                            Frequency Schedule
                        </h3>
                        <div className="space-y-3">
                            {["00:00", "06:00", "12:00", "18:00"].map((time, i) => (
                                <div key={time} className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5">
                                    <span className="font-mono text-gray-300">{time} UTC</span>
                                    {i === 2 ? (
                                        <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                            <CheckCircle size={12} /> COMPLETED
                                        </span>
                                    ) : i === 3 ? (
                                        <span className={`text-xs font-bold ${isProcessing ? 'text-yellow-500 animate-pulse' : 'text-neon-cyan'}`}>
                                            {isProcessing ? "RUNNING..." : "PENDING"}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-600">WAITING</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-engine-dark border border-white/10 rounded-xl p-6 h-[300px] flex flex-col">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Terminal size={16} className="text-gray-400" />
                            Live Console
                        </h3>
                        <div className="flex-1 bg-black rounded p-3 font-mono text-xs text-green-500 overflow-y-auto font-light leading-relaxed">
                            {logs.map((log, i) => (
                                <div key={i} className="mb-1">{log}</div>
                            ))}
                            <div className="animate-pulse">_</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Latest Report */}
                <div className="lg:col-span-2">
                    <div className="bg-engine-dark border border-white/10 rounded-xl p-6 h-full min-h-[500px]">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <FileText size={16} className="text-hologram-blue" />
                                Latest Intelligence Report
                            </h3>
                            <span className="text-xs font-mono text-gray-400">ID: {report.includes("4292") ? "RPT-4292" : "RPT-4291"}</span>
                        </div>

                        <article className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-neon-cyan prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white">
                            <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>').replace(/# (.*)/g, '<h1 class="text-2xl mb-4">$1</h1>').replace(/## (.*)/g, '<h2 class="text-xl mt-6 mb-3 text-neon-cyan">$1</h2>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />
                        </article>
                    </div>
                </div>

            </div>
        </div>
    );
}
