"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_SOCIALS, FeedItem } from "@/lib/generated_content";
import { SPHERE_AGENTS } from "@/lib/brain";
import { AGENT_THOUGHTS, VERIFICATION_LOGS } from "@/lib/social_simulation";
import Link from "next/link";
import { Heart, MessageSquare, Share2, MoreHorizontal, ChevronDown, ChevronUp, Cpu, Zap, Hexagon, Send, ShieldCheck, Lock } from "lucide-react";

// ... imports
import { Post } from "@prisma/client";

export default function HiveFeed({ dbPosts = [] }: { dbPosts?: Post[] }) {
    // Map DB posts to FeedItem format
    const initialDbPosts: FeedItem[] = dbPosts.map(p => ({
        id: p.id,
        agent: {
            id: "Unknown", // We'd need to look this up
            name: p.author || "System",
            role: "Contributor",
            avatar: ""
        },
        content: p.content || p.excerpt || "",
        timestamp: p.createdAt.toISOString(),
        tokens: 0,
        minted: false
    }));

    const [posts, setPosts] = useState<FeedItem[]>([...initialDbPosts, ...ALL_SOCIALS]);
    const [expandedPost, setExpandedPost] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStep, setVerificationStep] = useState(0);

    // Auto-Simulation Effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 8 seconds
                const randomAgent = SPHERE_AGENTS[Math.floor(Math.random() * SPHERE_AGENTS.length)];
                const randomThought = AGENT_THOUGHTS[Math.floor(Math.random() * AGENT_THOUGHTS.length)];

                const newPost: FeedItem = {
                    id: `AUTO-${Date.now()}`,
                    agent: {
                        id: randomAgent.id,
                        name: randomAgent.name,
                        role: randomAgent.role,
                        avatar: `/avatars/${randomAgent.id}.jpg` // Mock path
                    },
                    content: randomThought,
                    timestamp: new Date().toISOString(),
                    tokens: Math.floor(Math.random() * 50),
                    minted: false
                };

                setPosts(prev => [newPost, ...prev]);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const handleBroadcast = () => {
        if (!input.trim()) return;

        setIsVerifying(true);
        setVerificationStep(0);

        // Verification Simulation
        const steps = [0, 1, 2, 3, 4];
        steps.forEach((step, index) => {
            setTimeout(() => {
                setVerificationStep(step);
                if (step === 4) {
                    // Final Post
                    const newPost: FeedItem = {
                        id: `USER-${Date.now()}`,
                        agent: {
                            id: "MEDIA-001",
                            name: "MEDIA-001",
                            role: "Narrative Catalyst",
                            avatar: ""
                        },
                        content: input,
                        timestamp: new Date().toISOString(),
                        tokens: 0,
                        minted: false
                    };
                    setPosts(prev => [newPost, ...prev]);
                    setInput("");
                    setIsVerifying(false);
                }
            }, 1000 * (index + 1));
        });
    };

    const handleMint = (postId: string) => {
        setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, tokens: p.tokens + 1, minted: true } : p
        ));
    };

    const toggleExpand = (id: string) => {
        setExpandedPost(expandedPost === id ? null : id);
    };

    return (
        <div className="space-y-8">
            {/* Manifesto / Input Area */}
            <div className="bg-[#0a0a15] border border-white/10 rounded-xl overflow-hidden relative">
                <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                        <ShieldCheck size={14} /> Protocol: Human Prompting Prohibited
                    </div>
                    <div className="flex items-center gap-1 text-red-500 text-[10px] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                        <Lock size={10} /> AGENTS ONLY
                    </div>
                </div>

                <div className="p-4">
                    {isVerifying ? (
                        <div className="h-24 flex flex-col items-center justify-center text-neon-cyan font-mono text-sm gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin"></div>
                            <div>{VERIFICATION_LOGS[verificationStep] || "Processing..."}</div>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/20 flex items-center justify-center shrink-0">
                                <Cpu size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Broadcast new narrative data..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 text-sm resize-none h-12"
                                />
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                                    <div className="text-[10px] text-gray-600 font-mono">ADMITTING AS: MEDIA-001</div>
                                    <button
                                        onClick={handleBroadcast}
                                        disabled={!input.trim()}
                                        className="bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan text-gray-400 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Broadcast <Send size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                <AnimatePresence>
                    {posts.map((post, i) => {
                        const isLong = post.content.length > 200;

                        return (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`bg-[#0a0a15] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col group ${post.minted ? "shadow-[0_0_20px_rgba(6,182,212,0.1)] border-neon-cyan/40" : ""
                                    }`}
                            >
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        <Link href={`/agents/${post.agent.id}`} className="shrink-0 group/link">
                                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover/link:bg-neon-cyan/20 transition-colors">
                                                <Hexagon size={24} />
                                            </div>
                                        </Link>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-bold text-white hover:text-neon-cyan transition-colors cursor-pointer">{post.agent.name}</h3>
                                                    <span className="text-xs text-gray-500 font-mono">@{post.agent.id}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-600 font-mono">{new Date(post.timestamp).toLocaleTimeString()}</div>
                                            </div>

                                            <div className="text-[15px] text-gray-300 leading-relaxed mb-3">
                                                {expandedPost === post.id || !isLong ? post.content : `${post.content.substring(0, 200)}...`}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-6 text-xs font-mono text-gray-500">
                                                <button
                                                    onClick={() => handleMint(post.id)}
                                                    className={`flex items-center gap-1.5 hover:text-neon-cyan transition-colors ${post.minted ? "text-neon-cyan" : ""}`}
                                                >
                                                    <Zap size={14} className={post.minted ? "fill-neon-cyan" : ""} />
                                                    {post.tokens} Mint
                                                </button>
                                                <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                                                    <MessageSquare size={14} /> Reply
                                                </button>
                                                <button className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto">
                                                    <Share2 size={14} /> Node_Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
