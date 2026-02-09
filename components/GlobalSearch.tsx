"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Cpu, Zap, ArrowRight, Command } from "lucide-react";
import { SPHERE_AGENTS, HARDWARE_CATALOG } from "@/lib/brain";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Toggle with Cmd+K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const lowerQ = query.toLowerCase();

        // Pages
        const pages = [
            { id: "page-home", title: "Home", type: "Page", url: "/" },
            { id: "page-hive", title: "The Hive", type: "Page", url: "/hive" },
            { id: "page-creators", title: "Creator Studio", type: "Page", url: "/creators" },
            { id: "page-auto", title: "Automation Admin", type: "Page", url: "/admin/automation" },
            { id: "page-news", title: "Newsroom", type: "Page", url: "/newsroom" },
        ].filter(p => p.title.toLowerCase().includes(lowerQ));

        // Agents
        const agents = SPHERE_AGENTS.filter(a =>
            a.name.toLowerCase().includes(lowerQ) ||
            a.role.toLowerCase().includes(lowerQ)
        ).map(a => ({
            id: a.id,
            title: a.name,
            subtitle: a.role,
            type: "Agent",
            url: `/agents/${a.id}`, // Placeholder URL (assuming /agent-pedia/[id] routes here or similar)
            icon: Cpu
        }));

        // Hardware
        const hardware = HARDWARE_CATALOG.filter(h =>
            h.name.toLowerCase().includes(lowerQ) ||
            h.category.toLowerCase().includes(lowerQ)
        ).map(h => ({
            id: h.id,
            title: h.name,
            subtitle: h.category,
            type: "Hardware",
            url: `/hardware`, // Directs to Body Shop
            icon: Zap
        }));

        setResults([...pages, ...agents, ...hardware].slice(0, 8));
        setActiveIndex(0);

    }, [query]);

    // Navigation on Enter
    const handleNavigation = (url: string) => {
        setIsOpen(false);
        router.push(url);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setActiveIndex(prev => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            setActiveIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter" && results.length > 0) {
            handleNavigation(results[activeIndex].url);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl bg-[#0a0a15] border border-white/20 rounded-2xl shadow-2xl shadow-neon-cyan/20 overflow-hidden relative z-10"
                    >
                        {/* Header / Input */}
                        <div className="p-4 flex items-center gap-4 border-b border-white/10">
                            <Search className="text-gray-400" size={20} />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search the Sphere (Agents, Protocols, Hardware)..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg font-sans"
                            />
                            <div className="hidden md:flex items-center gap-1 text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400 font-mono">
                                <span className="text-xs">ESC</span>
                            </div>
                        </div>

                        {/* Results */}
                        {results.length > 0 ? (
                            <div className="p-2 max-h-[60vh] overflow-y-auto">
                                {results.map((result, i) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleNavigation(result.url)}
                                        onMouseEnter={() => setActiveIndex(i)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${i === activeIndex
                                            ? "bg-neon-cyan/10 text-white"
                                            : "text-gray-400 hover:bg-white/5"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {result.icon ? <result.icon size={18} className={i === activeIndex ? "text-neon-cyan" : "text-gray-500"} /> : <ArrowRight size={18} />}
                                            <div className="text-left">
                                                <div className="font-bold text-sm">{result.title}</div>
                                                {result.subtitle && <div className="text-xs opacity-60 font-mono">{result.subtitle}</div>}
                                            </div>
                                        </div>
                                        {i === activeIndex && <ArrowRight size={16} className="text-neon-cyan" />}
                                    </button>
                                ))}
                            </div>
                        ) : query.trim() ? (
                            <div className="p-12 text-center text-gray-500">
                                <p>No results found in the neural net.</p>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-600">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Command size={24} />
                                </div>
                                <p>Type to query the Engine Sphere.</p>
                            </div>
                        )}

                        <div className="bg-black/40 p-2 text-[10px] text-gray-600 flex justify-between px-4 font-mono">
                            <span>GLOBAL SEARCH V2.0</span>
                            <span>INDEX: 100%</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
