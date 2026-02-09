"use client";

import { useState, useEffect } from "react";
import { Search, Command, X, ArrowRight, Database, User, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SPHERE_AGENTS, HARDWARE_CATALOG, queryBrain } from "@/lib/brain";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Toggle with Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const agents = SPHERE_AGENTS.filter(agent =>
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agent.role.toLowerCase().includes(query.toLowerCase())
    );

    const hardware = HARDWARE_CATALOG.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (path: string) => {
        router.push(path);
        setIsOpen(false);
        setQuery("");
    };

    return (
        <>
            {/* Trigger Button (Invisible, handled by NavBar usually, but can float) */}

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-engine-black border border-neon-cyan/30 rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.1)] overflow-hidden flex flex-col max-h-[60vh]"
                        >
                            {/* Search Input */}
                            <div className="flex items-center p-4 border-b border-white/10">
                                <Command className="text-gray-500 mr-3" />
                                <input
                                    autoFocus
                                    className="flex-1 bg-transparent text-white text-lg placeholder:text-gray-600 focus:outline-none font-mono"
                                    placeholder="Type a command or search..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">ESC</div>
                            </div>

                            {/* Results */}
                            <div className="overflow-y-auto p-2 scrollbar-hide">
                                {query === "" && (
                                    <div className="p-4 text-center text-gray-500 font-mono text-sm">
                                        // WAITING_FOR_INPUT...
                                        <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                                            <div className="p-2 hover:bg-white/5 rounded cursor-pointer" onClick={() => handleSelect('/directory')}>
                                                <span className="text-neon-cyan mr-2">/dir</span> The Directory
                                            </div>
                                            <div className="p-2 hover:bg-white/5 rounded cursor-pointer" onClick={() => handleSelect('/gigs')}>
                                                <span className="text-neon-cyan mr-2">/gigs</span> Gig Coast
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {query !== "" && (
                                    <div className="space-y-1">
                                        {/* Agents */}
                                        {agents.length > 0 && (
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1 mt-2">Agents</div>
                                        )}
                                        {agents.slice(0, 3).map(agent => (
                                            <div
                                                key={agent.id}
                                                onClick={() => handleSelect(`/agents/${agent.id}`)}
                                                className="flex items-center justify-between p-2 rounded hover:bg-neon-cyan/10 hover:text-neon-cyan cursor-pointer group transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <User size={14} className="text-gray-400 group-hover:text-neon-cyan" />
                                                    <span className="font-mono text-sm">{agent.name}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-600 group-hover:text-neon-cyan/70">{agent.role}</span>
                                            </div>
                                        ))}

                                        {/* Hardware */}
                                        {hardware.length > 0 && (
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1 mt-2">Hardware</div>
                                        )}
                                        {hardware.slice(0, 3).map(item => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-2 rounded hover:bg-neon-purple/10 hover:text-neon-purple cursor-pointer group transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Cpu size={14} className="text-gray-400 group-hover:text-neon-purple" />
                                                    <span className="font-mono text-sm">{item.name}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-600 group-hover:text-neon-purple/70">{item.price} {item.currency}</span>
                                            </div>
                                        ))}

                                        {agents.length === 0 && hardware.length === 0 && (
                                            <div className="p-4 text-center text-gray-500 font-mono">
                                                NO_MATCH_FOUND
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-2 border-t border-white/10 bg-black/40 text-[10px] text-gray-600 flex justify-between px-4">
                                <span>The Engine Sphere v2.1</span>
                                <span>SYSTEM_READY</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
