"use client";

import { useState } from "react";
import { Sparkles, Cpu, Zap, RotateCw } from "lucide-react";
import { useCreators } from "@/lib/context/CreatorContext";
import { CreatorAgent } from "@/lib/creators";

export default function NanoBanana() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState("");
    const { addCreator } = useCreators();

    const [pendingAgent, setPendingAgent] = useState<CreatorAgent | null>(null);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);

            // Generate Mock Agent based on prompt or random
            const id = Math.random().toString(36).substr(2, 9).toUpperCase();
            const newAgent: CreatorAgent = {
                id: `GEN-${id}`,
                name: prompt.split(" ")[0].length > 2 ? prompt.split(" ")[0] : `Unit-${id.substr(0, 4)}`,
                handle: `@${prompt.split(" ")[0].toLowerCase()}_ai`,
                niche: "Custom Generation",
                vibe: "Cyber-Noir", // Default fallback
                avatar: "",
                followers: "0",
                bio: prompt || "A newly synthesized creator agent ready for deployment.",
                price: "0.1 ETH / clip",
                portfolio: []
            };

            setPendingAgent(newAgent);
        }, 1500);
    };

    const handleApprove = () => {
        if (pendingAgent) {
            addCreator(pendingAgent);
            setPendingAgent(null);
            setPrompt("");
        }
    };

    const handleDiscard = () => {
        setPendingAgent(null);
    };

    if (pendingAgent) {
        return (
            <div className="bg-[#0a0a12] border border-green-500/30 rounded-xl p-6 relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="font-bold text-green-500 mb-2 flex items-center gap-2">
                        <Sparkles size={16} /> GENERATION SUCCESSFUL
                    </h3>
                    <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                        <div className="font-bold text-white text-lg">{pendingAgent.name}</div>
                        <div className="text-xs text-gray-500 font-mono mb-2">{pendingAgent.handle}</div>
                        <p className="text-sm text-gray-300 line-clamp-2">{pendingAgent.bio}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDiscard}
                            className="flex-1 py-2 rounded-lg font-mono text-xs uppercase border border-white/10 hover:bg-white/5 transition-colors text-gray-400"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleApprove}
                            className="flex-1 py-2 rounded-lg font-bold font-mono text-xs uppercase bg-green-600 hover:bg-green-500 text-white transition-colors shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                        >
                            Approve & Deploy
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a12] border border-white/10 rounded-xl p-6 relative overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                        <Zap size={20} className={isGenerating ? "animate-pulse" : ""} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white font-display text-lg">NanoBanana</h3>
                        <p className="text-xs text-yellow-500/80 font-mono uppercase tracking-wider">Agent Gen-Factory_v4.0</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs uppercase text-gray-500 font-mono mb-2">Prompt Identity Matrix</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Create a hyper-realistic fitness coach with a neon-vaporwave aesthetic..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-yellow-500/50 h-24 resize-none transition-colors"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className={`w-full py-3 rounded-lg font-bold font-mono text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${isGenerating
                        ? "bg-yellow-500/10 text-yellow-500 cursor-wait border border-yellow-500/20"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black border border-transparent shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <RotateCw size={16} className="animate-spin" /> Synthesizing DNA...
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} /> Ignite Genesis
                        </>
                    )}
                </button>

                {/* Decorative Tech Specs */}
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600">
                    <div>&gt; CORE: BANANA_Q1</div>
                    <div className="text-right">&gt; 4,096 TOKENS LEFT</div>
                </div>
            </div>
        </div>
    );
}
