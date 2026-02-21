"use client";

import { CheckCircle2, Circle, Cpu, Fingerprint, Network, Radio, Link2, Sparkles, Workflow, ExternalLink, Save } from "lucide-react";
import Link from "next/link";
import { User, AgentWorkflow, Badge } from "@prisma/client";
import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

interface NovaProps {
    user: any;
    workflows: any[];
    badges: any[];
}

export function NovaChecklist({ user, workflows, badges }: NovaProps) {
    const router = useRouter();
    const score = user.onboardingScore || 0;
    
    // Inline state management
    const [activePhase, setActivePhase] = useState<number | null>(null);
    const [inputData, setInputData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleAction = async (phaseId: number) => {
        setLoading(true);
        try {
            if (phaseId === 2) await updateProfile({ username: inputData.username });
            if (phaseId === 3) await updateProfile({ socialHandles: { twitter: inputData.twitter, linkedin: inputData.linkedin } });
            if (phaseId === 4) await updateProfile({ rawAboutMe: inputData.rawAboutMe });
            if (phaseId === 5) await updateProfile({ rawPortfolio: inputData.rawPortfolio });
            
            setActivePhase(null);
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Evaluate progression strictly
    const phases = [
        { id: 1, title: "Initialize Core Identity", desc: "Clerk Authentication secured.", done: true, wait: false },
        { id: 2, title: "Claim Network Handle", desc: `Registered @${user.username || '...'}`, done: !!user.username, wait: !user.username },
        { id: 3, title: "Establish Comm Links", desc: "Social channels connected.", done: !!(user.socialHandles?.twitter || user.socialHandles?.linkedin), wait: !user.username },
        { id: 4, title: "Deposit Raw History", desc: "Raw 'About Me' log received.", done: !!user.rawAboutMe, wait: !user.socialHandles },
        { id: 5, title: "Deposit Raw Ledger", desc: "Raw Portfolio/CV log received.", done: !!user.rawPortfolio, wait: !user.rawAboutMe },
        { id: 6, title: "AI Core: Lore Analysis", desc: "Nova parsed About Me narrative.", done: !!user.aiAboutMe, wait: !user.rawAboutMe, auto: true },
        { id: 7, title: "AI Core: Portfolio Render", desc: "Nova parsed Portfolio data.", done: !!user.aiPortfolio, wait: !user.rawPortfolio, auto: true },
        { id: 8, title: "Webhooks Hooked", desc: "N8N Automations linked in The Mind.", done: workflows.length > 0, wait: !user.aiPortfolio },
        { id: 9, title: "Artifact Minted", desc: "First gamification Badge created.", done: badges.length > 0, wait: workflows.length === 0 },
        { id: 10, title: "System Operational", desc: "Nova assumes full command.", done: score >= 10, wait: score < 9 }
    ];

    const progressPercent = (phases.filter(p => p.done).length / 10) * 100;
    const isActive = progressPercent === 100;

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col md:flex-row bg-engine-dark border border-white/10 rounded-xl overflow-hidden relative shadow-2xl">
            
            {/* The Nova Persona Pane */}
            <div className="md:w-1/3 border-r border-white/10 relative p-6 flex flex-col items-center justify-center bg-black/50 group overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-neon-cyan/20 to-purple-900/40' : 'from-red-900/20 to-black'} transition-colors duration-1000`}></div>
                
                {/* Visual Representation of Nova */}
                <div className={`w-36 h-36 rounded-full border-4 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-1000
                    ${isActive ? 'border-neon-cyan shadow-[0_0_50px_rgba(0,243,255,0.4)]' : 'border-gray-800'}`}>
                    
                    {/* Placeholder for Nova's actual image if user drops it in /public/nova.png, 
                        for now we use the stylized CPU AI icon */}
                    <Cpu size={64} className={`${isActive ? 'text-neon-cyan animate-pulse' : 'text-gray-600'}`} />
                    
                    {isActive && (
                        <div className="absolute inset-0 rounded-full bg-neon-cyan/10 animate-ping"></div>
                    )}
                </div>

                <div className="relative z-10 text-center mt-6 w-full">
                    <h2 className="font-display font-bold text-2xl tracking-widest uppercase text-white">N o v a</h2>
                    <p className={`font-mono text-xs mt-2 ${isActive ? 'text-neon-cyan' : 'text-red-500'}`}>
                        {isActive ? '[ MERLIN_OROBOROS_LINK_ACTIVE ]' : '[ INITIALIZATION_AWAITING_DATA ]'}
                    </p>
                    <div className="w-full bg-gray-900 h-2 rounded-full mt-4 overflow-hidden border border-white/5">
                        <div 
                            className={`h-full ${isActive ? 'bg-neon-cyan shadow-[0_0_10px_#00f3ff]' : 'bg-red-500'} transition-all duration-1000`} 
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-400 font-mono text-[10px] mt-2 text-right">{progressPercent.toFixed(0)}% SYNCHED</p>
                </div>

                {/* System Readout */}
                <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-gray-500 opacity-50 flex flex-col gap-1">
                    <span>PWR: OPTIMAL</span>
                    <span>MEM: INFINITE</span>
                    <span>LLM: GEMINI_3.1_PRO</span>
                </div>
            </div>

            {/* The Success Formula Checklist */}
            <div className="md:w-2/3 p-6 flex flex-col items-start overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
                <div className="mb-6 w-full flex items-center justify-between sticky top-0 bg-engine-dark pb-4 z-10 border-b border-white/5">
                    <div>
                        <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                            <Fingerprint className="text-neon-purple"/> 
                            The Success Formula
                        </h3>
                        <p className="text-sm font-mono text-gray-400 mt-1">10-Phase System Boot Sequence</p>
                    </div>
                    {user.username && (
                        <Link href={`/u/${user.username}`} target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white transition-colors">
                            <ExternalLink size={14}/> VIEW_PUBLIC_PROFILE
                        </Link>
                    )}
                </div>

                <div className="w-full space-y-3">
                    {phases.map((phase, index) => (
                        <div 
                            key={phase.id} 
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-colors
                                ${phase.done ? 'bg-green-900/10 border-green-500/20' : 
                                  phase.wait ? 'bg-black/20 border-white/5 opacity-40' : 
                                  'bg-white/5 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]'}`}
                        >
                            <div className="mt-0.5">
                                {phase.done ? (
                                    <CheckCircle2 size={20} className="text-green-500" />
                                ) : phase.wait ? (
                                    <Circle size={20} className="text-gray-700" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin"></div>
                                )}
                            </div>
                            
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold font-display tracking-widest uppercase ${phase.done ? 'text-green-400' : phase.wait ? 'text-gray-600' : 'text-neon-cyan'}`}>
                                    Phase 0{phase.id}: {phase.title}
                                </h4>
                                <p className="text-sm text-gray-400 mt-1">{phase.desc}</p>
                                
                                {/* Action Buttons for Pending Phases */}
                                {!phase.done && !phase.wait && !phase.auto && phase.id <= 5 && activePhase !== phase.id && (
                                    <div className="mt-3">
                                        <button 
                                            onClick={() => setActivePhase(phase.id)}
                                            className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded font-mono text-[10px] hover:bg-neon-purple/40 transition-colors uppercase tracking-widest"
                                        >
                                            CONNECT_{phase.title.replace(/\s+/g, '_')}
                                        </button>
                                    </div>
                                )}

                                {/* Expanded Inline Form */}
                                {activePhase === phase.id && (
                                    <div className="mt-4 p-4 bg-[#050510] border border-white/10 rounded-lg">
                                        {phase.id === 2 && (
                                            <input 
                                                type="text" 
                                                placeholder="e.g. nova" 
                                                onChange={(e) => setInputData({...inputData, username: e.target.value})}
                                                className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white font-mono mb-3"
                                            />
                                        )}
                                        {phase.id === 3 && (
                                            <div className="space-y-2 mb-3">
                                                <input type="text" placeholder="Twitter URL" onChange={(e) => setInputData({...inputData, twitter: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white font-mono" />
                                                <input type="text" placeholder="LinkedIn URL" onChange={(e) => setInputData({...inputData, linkedin: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-white font-mono" />
                                            </div>
                                        )}
                                        {(phase.id === 4 || phase.id === 5) && (
                                            <textarea 
                                                placeholder={`Paste raw ${phase.id === 4 ? 'About Me' : 'Portfolio'} logs here...`}
                                                onChange={(e) => setInputData({...inputData, [phase.id === 4 ? 'rawAboutMe' : 'rawPortfolio']: e.target.value})}
                                                className="w-full h-32 bg-black border border-white/20 rounded px-3 py-2 text-sm text-white font-mono mb-3 resize-none"
                                            />
                                        )}
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleAction(phase.id)}
                                                disabled={loading}
                                                className="px-4 py-2 bg-neon-cyan text-black font-bold text-xs rounded hover:bg-white transition-colors flex items-center gap-2"
                                            >
                                                {loading ? "TRANSMITTING..." : <><Save size={14}/> STORE IN MAINFRAME</>}
                                            </button>
                                            <button 
                                                onClick={() => setActivePhase(null)}
                                                className="px-4 py-2 border border-white/20 text-gray-400 font-bold text-xs rounded hover:bg-white/5 transition-colors"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!phase.done && !phase.wait && phase.id === 8 && (
                                    <div className="mt-3">
                                        <Link href="/master-admin/automation" className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded font-mono text-[10px] hover:bg-neon-cyan/40 transition-colors">
                                            LINK_WEBHOOKS
                                        </Link>
                                    </div>
                                )}
                                {!phase.done && !phase.wait && phase.id === 9 && (
                                    <div className="mt-3">
                                        <Link href="/master-admin/mind/world-builder" className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded font-mono text-[10px] hover:bg-yellow-500/40 transition-colors">
                                            MINT_BADGE
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
