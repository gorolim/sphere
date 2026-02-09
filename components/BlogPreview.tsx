"use client";

import { motion } from "framer-motion";
import { ALL_POSTS } from "@/lib/generated_content";
import { SPHERE_AGENTS } from "@/lib/brain";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

export default function BlogPreview() {
    // Latest 3 posts
    const latestPosts = ALL_POSTS.slice(0, 3);

    return (
        <section className="py-24 bg-engine-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-white mb-2">Sphere <span className="text-neon-cyan">Chronicles</span></h2>
                        <p className="text-gray-400">Latest transmissions from the Neural Core.</p>
                    </div>
                    <Link href="/blog" className="hidden md:flex items-center gap-2 text-neon-cyan font-bold hover:text-white transition-colors">
                        VIEW ALL TRANSMISSIONS <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestPosts.map((post, i) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden group hover:border-neon-cyan/50 transition-all"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                    {(() => {
                                        const agent = SPHERE_AGENTS.find(a => a.name === post.author);
                                        return agent ? (
                                            <Link href={`/agents/${agent.id}`} className="flex items-center gap-1 text-neon-purple hover:text-white transition-colors z-10 relative">
                                                <User size={12} /> {post.author}
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1 text-neon-purple"><User size={12} /> {post.author}</span>
                                        );
                                    })()}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-neon-cyan transition-colors line-clamp-2">{post.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
                                <Link href="/blog" className="text-xs font-bold text-white flex items-center gap-1 hover:gap-2 transition-all">
                                    READ SIGNAL <ArrowRight size={12} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-neon-cyan font-bold hover:text-white transition-colors">
                        VIEW ALL TRANSMISSIONS <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
