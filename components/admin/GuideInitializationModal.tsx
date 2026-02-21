"use client";

import { useState } from "react";
import { User, Cpu, Sparkles, Wand2, Database, Network } from "lucide-react";
import { initializeAgentCompanion } from "@/app/actions/agent";
import { motion, AnimatePresence } from "framer-motion";

export function GuideInitializationModal({ user }: { user: any }) {
    const [name, setName] = useState("Nova");
    const [prompt, setPrompt] = useState("an alien woman, hyper-realistic, glowing blue skin, white hair, cinematic lighting");
    const [model, setModel] = useState("gemini-3.1-pro-high");
    
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleGiveBirth = async () => {
        setStatus("saving");
        setErrorMsg("");

        const res = await initializeAgentCompanion({
            guideName: name,
            guidePrompt: prompt,
            guideModel: model
        });

        if (res.error) {
            setStatus("error");
            setErrorMsg(res.error);
        } else {
            setStatus("success");
            // Page will revalidate and unmount this component
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,transparent_70%)]"></div>
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-[#0a0a0f] border border-neon-cyan/50 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.2)] overflow-hidden relative"
            >
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan">
                            <Sparkles className="text-neon-cyan" size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold text-white tracking-wider uppercase">System Boot: Guide Avatar Initialization</h2>
                            <p className="text-neon-cyan font-mono text-sm">// REQUIRED_BEFORE_ACCESSING_NEXUS</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Before entering the Master Admin Terminal, you must format your infinite-memory companion. 
                            She will guide you through the 10-Phase Success Formula and orchestrate your deployed agents.
                        </p>

                        {/* Name Block */}
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-2">01. AVATAR_DESIGNATION</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan rounded-lg px-4 py-3 text-white outline-none font-bold tracking-widest uppercase transition-colors"
                            />
                        </div>

                        {/* Visual Prompt / Nano Bana */}
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-2 flex items-center justify-between">
                                <span>02. VISUAL_PROMPT (Nano Bana)</span>
                                <span className="text-[10px] text-gray-600">OR PROVIDE IMAGE URL</span>
                            </label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-24 bg-black/50 border border-white/10 focus:border-neon-cyan rounded-lg p-4 text-white outline-none font-mono text-sm resize-none transition-colors"
                                placeholder="Describe the avatar's appearance..."
                            />
                        </div>

                        {/* Engine Selection */}
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-2">03. COGNITIVE_ENGINE</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button 
                                    onClick={() => setModel("gemini-3.1-pro-high")}
                                    className={`p-3 rounded-lg border font-mono text-xs flex flex-col items-center gap-2 transition-all
                                        ${model === "gemini-3.1-pro-high" ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'bg-black/50 border-white/10 text-gray-500 hover:border-white/30'}`}
                                >
                                    <Cpu size={18} />
                                    <span>Gemini 3.1 Pro</span>
                                </button>
                                <button 
                                    onClick={() => setModel("claude-3.5-sonnet")}
                                    className={`p-3 rounded-lg border font-mono text-xs flex flex-col items-center gap-2 transition-all
                                        ${model === "claude-3.5-sonnet" ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-black/50 border-white/10 text-gray-500 hover:border-white/30'}`}
                                >
                                    <Database size={18} />
                                    <span>Claude 3.5</span>
                                </button>
                                <button 
                                    onClick={() => setModel("gpt-4o")}
                                    className={`p-3 rounded-lg border font-mono text-xs flex flex-col items-center gap-2 transition-all
                                        ${model === "gpt-4o" ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-black/50 border-white/10 text-gray-500 hover:border-white/30'}`}
                                >
                                    <Network size={18} />
                                    <span>GPT-4o</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black/80 border-t border-white/10 p-6 flex items-center justify-between">
                    <div>
                        {status === "error" && <p className="text-red-500 font-mono text-xs">{errorMsg}</p>}
                    </div>
                    
                    <button 
                        onClick={handleGiveBirth}
                        disabled={status === "saving" || status === "success"}
                        className="bg-white text-black px-8 py-3 rounded-lg font-bold font-display tracking-widest flex items-center gap-2 hover:bg-neon-cyan hover:shadow-[0_0_20px_#00f3ff] transition-all disabled:opacity-50"
                    >
                        {status === "saving" ? (
                            <span className="animate-pulse">INITIALIZING COMPANION...</span>
                        ) : status === "success" ? (
                            <span>{name.toUpperCase()} ONLINE</span>
                        ) : (
                            <>
                                <Wand2 size={18} />
                                GIVE BIRTH TO AVATAR
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
