import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Share2, Eye, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/db";

// Force dynamic to ensure we get fresh DB data
export const dynamic = "force-dynamic";

export default async function BlogPage() {
    // Fetch published posts
    const posts = await prisma.post.findMany({
        where: {
            status: "published",
            category: "chronicles"
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans">
            <NavBar />

            <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        THE SPHERE <span className="text-neon-cyan">CHRONICLES</span>
                    </h1>
                    <p className="font-mono text-neon-purple/80 tracking-widest uppercase text-sm">
                        [ TRANSMISSIONS_FROM_THE_CORE ]
                    </p>
                </div>

                <div className="space-y-12">
                    {posts.length === 0 && (
                        <div className="text-center p-12 border border-white/10 rounded-xl bg-white/5">
                            <p className="text-gray-400 font-mono">NO_TRANSMISSIONS_DETECTED</p>
                            <p className="text-xs text-gray-600 mt-2">The archives are empty or offline.</p>
                        </div>
                    )}

                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden hover:border-neon-cyan/30 transition-all group animate-in fade-in slide-in-from-bottom-8 duration-700"
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                                    <span className="flex items-center gap-1 text-neon-cyan">
                                        <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User size={12} /> {post.author || "System"}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-display font-bold mb-4 group-hover:text-neon-cyan transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-300 leading-relaxed mb-6">{post.excerpt}</p>

                                <div className="prose prose-invert prose-sm max-w-none border-l-2 border-white/10 pl-4">
                                    {/* Render content safely if possible, or just excerpt */}
                                    <div dangerouslySetInnerHTML={{ __html: (post.content || "").replace(/\n/g, '<br/>') }} />
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 text-xs font-mono text-gray-500">
                                    <div className="flex gap-4">
                                        {/* Mock stats for now */}
                                        <span className="flex items-center gap-1"><Eye size={14} /> 1.2k</span>
                                        <span className="flex items-center gap-1"><Share2 size={14} /> 45</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded">VERIFIED_SOURCE</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
