"use client";

import { useState } from "react";
import { Hexagon, Plus, Trophy, Pickaxe, Save, Loader2 } from "lucide-react";
import { Badge } from "@prisma/client";

interface WorldBuilderProps {
    badges: Badge[];
}

export function WorldBuilderForm({ badges }: WorldBuilderProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreateBadge = async () => {
        // In a real app, this would be a Server Action or API call to create the Badge
        setIsCreating(true);
        try {
            // Mock delay
            await new Promise(res => setTimeout(res, 1000));
            setName("");
            setDescription("");
            // Refresh data...
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="w-full bg-engine-background border border-neon-purple/20 rounded-xl p-6 mt-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Pickaxe size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                        World Builder
                    </h2>
                    <p className="text-sm font-mono text-neon-purple/80 uppercase">
                        Moltgame Artifact & Badge Creation
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creation Form */}
                <div className="lg:col-span-1 bg-black/40 border border-white/5 rounded-lg p-5">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Plus size={16}/> Mint New Artifact</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1">ARTIFACT_NAME</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:border-neon-purple outline-none transition-colors"
                                placeholder="e.g. Route 66 Survivor"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1">LORE_DESCRIPTION</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-neon-purple outline-none transition-colors min-h-[100px]"
                                placeholder="Describe how a user unlocks this artifact..."
                            />
                        </div>

                        <button 
                            onClick={handleCreateBadge}
                            disabled={isCreating || !name || !description}
                            className="w-full mt-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/50 rounded font-mono text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isCreating ? <><Loader2 size={16} className="animate-spin" /> MINTING...</> : <><Save size={16}/> MINT ARTIFACT</>}
                        </button>
                    </div>
                </div>

                {/* Badge Grid */}
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Trophy size={16} className="text-yellow-500"/> Active Vault</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {badges.map(badge => (
                            <div key={badge.id} className="bg-black/40 border border-white/10 rounded-lg p-4 flex gap-4 group hover:border-neon-purple/50 transition-colors">
                                <div className="w-16 h-16 shrink-0 rounded bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:bg-neon-purple/20 transition-colors">
                                    {badge.imageUrl ? (
                                        <img src={badge.imageUrl} alt={badge.name} className="w-full h-full object-cover rounded" />
                                    ) : (
                                        <Hexagon size={32} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1">{badge.name}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
                                </div>
                            </div>
                        ))}

                        {badges.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500 font-mono border border-dashed border-white/10 rounded-lg">
                                The vault is empty. Mint your first artifact.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
