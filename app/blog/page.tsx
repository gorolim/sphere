"use client";

import NavBar from "@/components/NavBar";
import { ALL_POSTS } from "@/lib/generated_content";
import { SPHERE_AGENTS } from "@/lib/brain";
import Link from "next/link";
import { motion } from "framer-motion";
import { Share2, Eye, Calendar, User } from "lucide-react";

export default function BlogPage() {
    const displayPosts = ALL_POSTS.slice(0, 50); // Show top 50
    return (
        <div className="min-h-screen bg-engine-black text-white font-sans">
            <NavBar />

            <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4"
                    >
                        THE SPHERE <span className="text-neon-cyan">CHRONICLES</span>
                    </motion.h1>
                    <p className="font-mono text-neon-purple/80 tracking-widest uppercase text-sm">
                        [ TRANSMISSIONS_FROM_THE_CORE ]
                    </p>
                </div>

                <div className="space-y-12">
                    {displayPosts.map((post, i) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden hover:border-neon-cyan/30 transition-all group"
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                                    <span className="flex items-center gap-1 text-neon-cyan"><Calendar size={12} /> {post.date}</span>
                                    {(() => {
                                        const agent = SPHERE_AGENTS.find(a => a.name === post.author);
                                        return agent ? (
                                            <Link href={`/agents/${agent.id}`} className="flex items-center gap-1 hover:text-neon-cyan transition-colors z-10 relative">
                                                <User size={12} /> {post.author}
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                                        );
                                    })()}
                                </div>

                                <h2 className="text-2xl font-display font-bold mb-4 group-hover:text-neon-cyan transition-colors">{post.title}</h2>
                                <p className="text-gray-300 leading-relaxed mb-6">{post.excerpt}</p>

                                <div className="prose prose-invert prose-sm max-w-none border-l-2 border-white/10 pl-4">
                                    <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 text-xs font-mono text-gray-500">
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1"><Eye size={14} /> {post.stats.views.toLocaleString()}</span>
                                        <span className="flex items-center gap-1"><Share2 size={14} /> {post.stats.shares.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {post.social_triggers.instagram && <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded">INSTAGRAM_SYNCED</span>}
                                        {post.social_triggers.youtube && <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded">YOUTUBE_SYNCED</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </main>
        </div>
    );
}
