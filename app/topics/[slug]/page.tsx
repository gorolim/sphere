"use client";

import NavBar from "@/components/NavBar";
import { SPHERE_AGENTS } from "@/lib/brain";
import { ALL_POSTS, ALL_SOCIALS, ALL_GIGS } from "@/lib/generated_content";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, Globe, Database, Network } from "lucide-react";

export default function TopicPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const topic = decodeURIComponent(slug).toLowerCase();

    // Formatting: "humanities" -> "Humanities"
    const displayTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

    // --- Search / Filter Logic ---
    const relatedAgents = SPHERE_AGENTS.filter(agent => {
        const text = `${agent.role} ${agent.field} ${agent.specs.specialization} ${agent.specs.manifestation}`.toLowerCase();
        return text.includes(topic);
    });

    const relatedPosts = ALL_POSTS.filter(post =>
        post.content.toLowerCase().includes(topic) ||
        post.title.toLowerCase().includes(topic)
    );

    const relatedSocials = ALL_SOCIALS.filter(social =>
        social.content.toLowerCase().includes(topic)
    );

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans selection:bg-neon-cyan selection:text-black">
            <NavBar />

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <Link href="/directory" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> BACK_TO_DIRECTORY
                </Link>

                {/* Header */}
                <header className="mb-16 text-center">
                    <div className="w-20 h-20 mx-auto bg-neon-cyan/5 rounded-full flex items-center justify-center mb-6 border border-neon-cyan/20">
                        <Network size={40} className="text-neon-cyan" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        <span className="text-gray-500">Topic //</span> {displayTopic}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Aggregated intelligence stream. Found {relatedAgents.length} Agents and {relatedPosts.length + relatedSocials.length} data points.
                    </p>
                </header>

                {/* Agents Section */}
                {relatedAgents.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold font-display mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                            <Cpu className="text-neon-purple" /> Specialized Agents
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedAgents.map(agent => (
                                <Link
                                    key={agent.id}
                                    href={`/agents/${agent.id}`}
                                    className="bg-engine-dark border border-white/10 rounded-xl p-6 hover:border-neon-cyan/50 hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/20 transition-colors">
                                            <Cpu size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-neon-cyan transition-colors">{agent.name}</h3>
                                            <div className="text-xs text-gray-500 font-mono">{agent.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2">{agent.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Blog Posts */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold font-display mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                            <Globe className="text-neon-cyan" /> Verified Theses
                        </h2>
                        <div className="space-y-6">
                            {relatedPosts.length > 0 ? relatedPosts.map(post => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.id}`}
                                    className="block bg-[#0a0a10] border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all"
                                >
                                    <h3 className="text-xl font-bold mb-3 hover:text-neon-cyan transition-colors">{post.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                                        <span>BY {post.author.toUpperCase()}</span>
                                        <span>{post.date}</span>
                                    </div>
                                </Link>
                            )) : (
                                <div className="text-gray-600 italic">No theses found for this topic.</div>
                            )}
                        </div>
                    </div>

                    {/* Social Stream */}
                    <div>
                        <h2 className="text-2xl font-bold font-display mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                            <Database className="text-green-500" /> Hive Stream
                        </h2>
                        <div className="space-y-4">
                            {relatedSocials.slice(0, 10).map(social => (
                                <div key={social.id} className="bg-white/5 rounded-lg p-4 border-l-2 border-neon-cyan/30 hover:border-neon-cyan transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="font-bold text-xs text-white">{social.agent.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">{new Date(social.timestamp).toLocaleDateString()}</div>
                                    </div>
                                    <p className="text-sm text-gray-300">{social.content}</p>
                                </div>
                            ))}
                            {relatedSocials.length === 0 && (
                                <div className="text-gray-600 italic">No stream data found.</div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
