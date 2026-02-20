"use client";

import { useState } from "react";
import { Plus, RefreshCw, X, Search, MapPin, ShieldAlert, Settings } from "lucide-react";
import { fetchAndSyncJobs, updateSettingsArray } from "@/app/actions/job";
import { useRouter } from "next/navigation";

interface JobSettingsData {
    customKeywords: string[];
    locations: string[];
    excludedKeywords: string[];
}

interface ClientControlsProps {
    initialSettings: JobSettingsData;
}

export function JobTrackerClientControls({ initialSettings }: ClientControlsProps) {
    const [isFetching, setIsFetching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'keywords' | 'locations' | 'exclusions'>('keywords');
    
    // State lists
    const [settings, setSettings] = useState<JobSettingsData>(initialSettings);
    
    // Active input for each tab
    const [newInputs, setNewInputs] = useState({ keywords: "", locations: "", exclusions: "" });
    
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

    const handleAddItem = async (e: React.FormEvent, tab: keyof typeof newInputs) => {
        e.preventDefault();
        const value = newInputs[tab].trim();
        
        // Map tab string back to setting key
        const fieldMap: Record<string, keyof JobSettingsData> = {
            keywords: 'customKeywords',
            locations: 'locations',
            exclusions: 'excludedKeywords'
        };
        const field = fieldMap[tab];

        if (!value || settings[field].includes(value)) return;
        
        setNewInputs(prev => ({ ...prev, [tab]: "" }));
        
        const newArray = [...settings[field], value];
        
        // Optimistic update
        setSettings(prev => ({ ...prev, [field]: newArray }));
        
        // Save
        await updateSettingsArray(field, newArray);
    };

    const handleRemoveItem = async (tab: string, itemToRemove: string) => {
        const fieldMap: Record<string, keyof JobSettingsData> = {
            keywords: 'customKeywords',
            locations: 'locations',
            exclusions: 'excludedKeywords'
        };
        const field = fieldMap[tab];

        const newArray = settings[field].filter(k => k !== itemToRemove);
        setSettings(prev => ({ ...prev, [field]: newArray }));
        
        await updateSettingsArray(field, newArray);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors font-mono"
            >
                <Settings size={14} className="text-gray-400" />
                Filters
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-engine-dark border border-white/10 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h2 className="font-display font-bold text-white flex items-center gap-2">
                                <Settings className="text-gray-400" size={18} />
                                Job Crawler Settings
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex border-b border-white/10">
                            <button 
                                onClick={() => setActiveTab('keywords')}
                                className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-bold transition-colors ${activeTab === 'keywords' ? 'text-neon-purple border-b-2 border-neon-purple' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Search size={16} /> Keywords
                            </button>
                            <button 
                                onClick={() => setActiveTab('locations')}
                                className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-bold transition-colors ${activeTab === 'locations' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <MapPin size={16} /> Locations
                            </button>
                            <button 
                                onClick={() => setActiveTab('exclusions')}
                                className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-bold transition-colors ${activeTab === 'exclusions' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <ShieldAlert size={16} /> Exclusions
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Keywords Tab */}
                            {activeTab === 'keywords' && (
                                <div>
                                    <p className="text-sm text-gray-400 mb-4 font-mono">
                                        Jobs matching these keywords (plus standard ones like RLHF, AI Tutor) will be fetched.
                                    </p>
                                    <form onSubmit={(e) => handleAddItem(e, 'keywords')} className="flex gap-2 mb-6">
                                        <input
                                            type="text"
                                            value={newInputs.keywords}
                                            onChange={(e) => setNewInputs(prev => ({...prev, keywords: e.target.value}))}
                                            placeholder="e.g. Prompt Engineer..."
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple"
                                        />
                                        <button type="submit" className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                            <Plus size={20} />
                                        </button>
                                    </form>
                                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
                                        {settings.customKeywords.length === 0 && <p className="text-sm text-gray-600 font-mono italic">No custom keywords.</p>}
                                        {settings.customKeywords.map(kw => (
                                            <span key={kw} className="flex items-center gap-1.5 px-3 py-1 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-full text-sm font-mono shrink-0">
                                                {kw}
                                                <button onClick={() => handleRemoveItem('keywords', kw)} className="hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors" title="Remove">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Locations Tab */}
                            {activeTab === 'locations' && (
                                <div>
                                    <p className="text-sm text-gray-400 mb-4 font-mono">
                                        The candidate location string required by the job must contain one of these phrases.
                                    </p>
                                    <form onSubmit={(e) => handleAddItem(e, 'locations')} className="flex gap-2 mb-6">
                                        <input
                                            type="text"
                                            value={newInputs.locations}
                                            onChange={(e) => setNewInputs(prev => ({...prev, locations: e.target.value}))}
                                            placeholder="e.g. remote, latam, evropa..."
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                                        />
                                        <button type="submit" className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                            <Plus size={20} />
                                        </button>
                                    </form>
                                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
                                        {settings.locations.length === 0 && <p className="text-sm text-gray-600 font-mono italic">No locations. (Will fetch ANY location!)</p>}
                                        {settings.locations.map(loc => (
                                            <span key={loc} className="flex items-center gap-1.5 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded-full text-sm font-mono shrink-0">
                                                {loc}
                                                <button onClick={() => handleRemoveItem('locations', loc)} className="hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors" title="Remove">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Exclusions Tab */}
                            {activeTab === 'exclusions' && (
                                <div>
                                    <p className="text-sm text-gray-400 mb-4 font-mono">
                                        Jobs containing these phrases in the title or description will be IGNORED.
                                    </p>
                                    <form onSubmit={(e) => handleAddItem(e, 'exclusions')} className="flex gap-2 mb-6">
                                        <input
                                            type="text"
                                            value={newInputs.exclusions}
                                            onChange={(e) => setNewInputs(prev => ({...prev, exclusions: e.target.value}))}
                                            placeholder="e.g. US Only, requires clearance..."
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                        />
                                        <button type="submit" className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                            <Plus size={20} />
                                        </button>
                                    </form>
                                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
                                        {settings.excludedKeywords.length === 0 && <p className="text-sm text-gray-600 font-mono italic">No exclusions set.</p>}
                                        {settings.excludedKeywords.map(excl => (
                                            <span key={excl} className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-sm font-mono shrink-0">
                                                {excl}
                                                <button onClick={() => handleRemoveItem('exclusions', excl)} className="hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors" title="Remove">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-white/5 flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
