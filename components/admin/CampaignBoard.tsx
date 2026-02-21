"use client";

import { useState } from "react";
import { FileText, RadioReceiver, PenTool, Globe, ChevronRight, Loader2, Play } from "lucide-react";
import { MarketingCampaign } from "@prisma/client";

interface CampaignBoardProps {
    campaigns: MarketingCampaign[];
}

export function CampaignBoard({ campaigns }: CampaignBoardProps) {
    const [deployingId, setDeployingId] = useState<string | null>(null);

    const handleDeploy = async (campaignId: string) => {
        setDeployingId(campaignId);
        try {
            await fetch("/api/webhooks/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ campaignId })
            });
            // Simulate processing time
            await new Promise(res => setTimeout(res, 2000));
            // In a real app: revalidate data here
        } catch (error) {
            console.error("Failed to deploy campaign", error);
        } finally {
            setDeployingId(null);
        }
    };

    const columns = [
        { id: "RAW_TEXT", title: "Raw Thought / Journey", icon: <FileText size={16} /> },
        { id: "AI_DRAFTING", title: "AI Sync (n8n)", icon: <Loader2 size={16} className="animate-spin" /> },
        { id: "READY_FOR_PR", title: "Ready for Distro", icon: <PenTool size={16} /> },
        { id: "SYNDICATED", title: "Live Protocol", icon: <Globe size={16} /> }
    ];

    return (
        <div className="w-full bg-engine-background border border-white/10 rounded-xl p-6 mt-8 overflow-x-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                    <RadioReceiver size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                        The Master Narrative
                    </h2>
                    <p className="text-sm font-mono text-gray-500 uppercase">
                        Oroboros Content Loop Dashboard
                    </p>
                </div>
            </div>

            <div className="flex gap-6 min-w-max">
                {columns.map(col => (
                    <div key={col.id} className="w-80 flex flex-col bg-black/40 border border-white/5 rounded-lg overflow-hidden">
                        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2 text-sm font-mono text-gray-300">
                            {col.icon} {col.title}
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col gap-4 min-h-[300px]">
                            {campaigns.filter(c => c.status === col.id).map(campaign => (
                                <div key={campaign.id} className="bg-black/60 border border-white/10 p-4 rounded shadow-lg group hover:border-neon-cyan/50 transition-colors">
                                    <h3 className="font-bold text-white text-sm mb-2">{campaign.title}</h3>
                                    <p className="text-xs text-gray-500 font-mono mb-4 truncate text-ellipsis">{campaign.id}</p>
                                    
                                    {col.id === "RAW_TEXT" && (
                                        <button 
                                            onClick={() => handleDeploy(campaign.id)}
                                            disabled={deployingId === campaign.id}
                                            className="w-full py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan rounded text-xs font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {deployingId === campaign.id ? <><Loader2 size={12} className="animate-spin"/> IGNITING...</> : <><Play size={12}/> PROCESS JOURNEY</>}
                                        </button>
                                    )}

                                    {col.id === "READY_FOR_PR" && (
                                        <button 
                                            onClick={() => handleDeploy(campaign.id)}
                                            disabled={deployingId === campaign.id}
                                            className="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded text-xs font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {deployingId === campaign.id ? <><Loader2 size={12} className="animate-spin"/> SYNDICATING...</> : <><Globe size={12}/> DEPLOY CAMPAIGN</>}
                                        </button>
                                    )}

                                    {col.id === "SYNDICATED" && (
                                        <div className="flex items-center gap-2">
                                            {campaign.twitterUrl && <div className="w-6 h-6 rounded bg-[#1DA1F2]/20 flex items-center justify-center border border-[#1DA1F2]/50 text-[#1DA1F2] text-xs font-bold">X</div>}
                                            {campaign.linkedInUrl && <div className="w-6 h-6 rounded bg-[#0A66C2]/20 flex items-center justify-center border border-[#0A66C2]/50 text-[#0A66C2] text-xs font-bold">in</div>}
                                            {campaign.igUrl && <div className="w-6 h-6 rounded bg-pink-500/20 flex items-center justify-center border border-pink-500/50 text-pink-500 text-xs font-bold">IG</div>}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {campaigns.filter(c => c.status === col.id).length === 0 && (
                                <div className="text-xs font-mono text-gray-600 text-center mt-8 border border-dashed border-white/5 p-4 rounded">
                                    No entries
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
