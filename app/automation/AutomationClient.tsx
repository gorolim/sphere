
"use client";

import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Plus, Globe, Trash2, Power } from "lucide-react";
import { createAutomation, deleteAutomation, toggleAutomation } from "@/app/actions/automation";

interface Automation {
    id: string;
    name: string;
    triggerType: string;
    webhookUrl: string;
    isActive: boolean;
}

export default function AutomationClient({ initialAutomations }: { initialAutomations: Automation[] }) {
    const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
    const [isCreating, setIsCreating] = useState(false);
    const [newAuto, setNewAuto] = useState({ name: "", triggerType: "NEW_POST", webhookUrl: "" });

    const handleCreate = async () => {
        if (!newAuto.name || !newAuto.webhookUrl) return;

        await createAutomation(newAuto.name, newAuto.triggerType, newAuto.webhookUrl);
        setIsCreating(false);
        setNewAuto({ name: "", triggerType: "NEW_POST", webhookUrl: "" });
        // Optimistic update or refresh needed in real app, here we rely on Server Action revalidatePath
        // effectively needing a page reload or router.refresh() if we want to see it instantly without full reload interaction logic.
        // For MVP, valid to just reload or let Next.js handle it.
        window.location.reload();
    };

    const handleDelete = async (id: string) => {
        await deleteAutomation(id);
        setAutomations(prev => prev.filter(a => a.id !== id));
    };

    const handleToggle = async (id: string) => {
        await toggleAutomation(id);
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    };

    return (
        <div className="min-h-screen bg-engine-black text-white relative">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-12 max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 text-neon-purple mb-2">
                            <Cpu />
                            <span className="font-mono text-xs tracking-widest uppercase">System_Automation_Core</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold">Workflow Control Center</h1>
                        <p className="text-gray-400 font-mono mt-2">Manage outbound neural triggers to n8n.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-black border border-neon-cyan/50 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> CONNECT WORKFLOW
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {/* Creation Form */}
                    <AnimatePresence>
                        {isCreating && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-engine-dark border border-neon-cyan/30 rounded-xl p-6 mb-6 overflow-hidden"
                            >
                                <h3 className="text-lg font-bold text-white mb-4">New Neural Link</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Workflow Name"
                                        value={newAuto.name}
                                        onChange={e => setNewAuto({ ...newAuto, name: e.target.value })}
                                        className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan outline-none"
                                    />
                                    <select
                                        title="Trigger Type"
                                        value={newAuto.triggerType}
                                        onChange={e => setNewAuto({ ...newAuto, triggerType: e.target.value })}
                                        className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan outline-none"
                                    >
                                        <option value="NEW_POST">Trigger: New Post Published</option>
                                        <option value="USER_SIGNUP">Trigger: New User Signup</option>
                                        <option value="AGENT_MESSAGE">Trigger: Agent Message</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="n8n Webhook URL"
                                        value={newAuto.webhookUrl}
                                        onChange={e => setNewAuto({ ...newAuto, webhookUrl: e.target.value })}
                                        className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                    <button onClick={handleCreate} className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-white transition-colors">
                                        ESTABLISH LINK
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Automation List */}
                    {automations.length === 0 ? (
                        <div className="bg-black/20 border border-dashed border-white/10 rounded-xl p-12 text-center">
                            <Globe className="mx-auto text-gray-600 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-400">No Active Data Streams</h3>
                            <p className="text-gray-600 mt-2">Connect an external n8n webhook to begin data transmission.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {automations.map(auto => (
                                <div key={auto.id} className="bg-engine-dark border border-white/10 rounded-xl p-6 flex justify-between items-center group hover:border-neon-cyan/30 transition-colors">
                                    <div>
                                        <h3 className="font-bold text-white mb-1 flex items-center gap-3">
                                            {auto.name}
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400">{auto.triggerType}</span>
                                        </h3>
                                        <div className="font-mono text-xs text-gray-500 truncate max-w-md">{auto.webhookUrl}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-xs font-mono px-2 py-1 rounded border ${auto.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                                            {auto.isActive ? "ACTIVE" : "PAUSED"}
                                        </div>
                                        <button
                                            onClick={() => handleToggle(auto.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            title="Toggle Status"
                                        >
                                            <Power size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(auto.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
