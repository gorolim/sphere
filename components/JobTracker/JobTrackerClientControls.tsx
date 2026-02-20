"use client";

import { useState } from "react";
import { Plus, RefreshCw, X, Search } from "lucide-react";
import { fetchAndSyncJobs, addCustomKeyword, removeCustomKeyword } from "@/app/actions/job";
import { useRouter } from "next/navigation";

interface ClientControlsProps {
    initialKeywords: string[];
}

export function JobTrackerClientControls({ initialKeywords }: ClientControlsProps) {
    const [isFetching, setIsFetching] = useState(false);
    const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
    const [newKeyword, setNewKeyword] = useState("");
    const [keywords, setKeywords] = useState<string[]>(initialKeywords);
    
    const router = useRouter();

    const handleFetch = async () => {
        setIsFetching(true);
        const res = await fetchAndSyncJobs();
        setIsFetching(false);
        
        if (res?.success) {
            router.refresh();
        } else {
            console.error(res?.error);
        }
    };

    const handleAddKeyword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyword.trim() || keywords.includes(newKeyword.trim())) return;
        
        const kw = newKeyword.trim();
        setNewKeyword("");
        
        // Optimistic update
        setKeywords([...keywords, kw]);
        
        const res = await addCustomKeyword(kw);
        // If error, we should ideally revert, but keeping it simple
    };

    const handleRemoveKeyword = async (kwToRemove: string) => {
        setKeywords(keywords.filter(k => k !== kwToRemove));
        await removeCustomKeyword(kwToRemove);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setIsKeywordModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors font-mono"
            >
                <Search size={14} className="text-neon-purple" />
                Keywords ({keywords.length})
            </button>

            <button
                onClick={handleFetch}
                disabled={isFetching}
                className={`flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/50 rounded-lg font-bold text-sm text-neon-cyan transition-all
                    ${isFetching ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
                {isFetching ? "Syncing API..." : "Fetch New Jobs"}
            </button>

            {/* Simple Modal for Keywords directly embedded */}
            {isKeywordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-engine-dark border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h2 className="font-display font-bold text-white flex items-center gap-2">
                                <Search className="text-neon-purple" size={18} />
                                Custom Keywords
                            </h2>
                            <button onClick={() => setIsKeywordModalOpen(false)} className="text-gray-500 hover:text-white transition-colors" title="Close modal" aria-label="Close custom keywords modal">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-sm text-gray-400 mb-4 font-mono">
                                Adding standard keywords (AI Tutor, RLHF, etc...) is automatic. Add custom ones here for future imports.
                            </p>
                            
                            <form onSubmit={handleAddKeyword} className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    placeholder="e.g. Prompt Engineer..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple"
                                />
                                <button type="submit" className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" title="Add Keyword" aria-label="Add Keyword">
                                    <Plus size={20} />
                                </button>
                            </form>

                            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
                                {keywords.length === 0 && (
                                    <p className="text-sm text-gray-600 font-mono italic">No custom keywords yet.</p>
                                )}
                                {keywords.map(kw => (
                                    <span key={kw} className="flex items-center gap-1.5 px-3 py-1 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-full text-sm font-mono">
                                        {kw}
                                        <button onClick={() => handleRemoveKeyword(kw)} className="hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors" title="Remove Keyword" aria-label="Remove Keyword">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/5 bg-white/5 flex justify-end">
                            <button onClick={() => setIsKeywordModalOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
