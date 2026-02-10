
"use client";

import { useState } from "react";
import { Eye, Edit2, Plus } from "lucide-react";
import { updatePostStatus } from "@/app/actions/post";

interface Post {
    id: string;
    title: string;
    status: string;
    category: string;
    createdAt: Date;
    author: string | null;
}

export default function PostsTable({ initialPosts }: { initialPosts: Post[] }) {
    // We can use optimistic updates here for immediate UI feedback
    const [posts, setPosts] = useState(initialPosts);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "published" ? "draft" : "published";

        // Optimistic update
        setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));

        try {
            await updatePostStatus(id, newStatus);
        } catch (e) {
            // Revert on error
            console.error("Failed to update status", e);
            setPosts(posts.map(p => p.id === id ? { ...p, status: currentStatus } : p));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold">Content Matrix</h1>
                    <p className="text-gray-400 text-sm">Manage Chronicles and Agent-Pedia entries.</p>
                </div>
                <button className="flex items-center gap-2 bg-neon-cyan text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors">
                    <Plus size={18} /> New Transmission
                </button>
            </div>

            <div className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 border-b border-white/10 font-mono text-gray-400">
                        <tr>
                            <th className="p-4">TITLE</th>
                            <th className="p-4">CATEGORY</th>
                            <th className="p-4">AUTHOR</th>
                            <th className="p-4">STATUS</th>
                            <th className="p-4 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 font-bold text-white">{post.title}</td>
                                <td className="p-4 text-gray-400 uppercase text-xs tracking-wider">{post.category}</td>
                                <td className="p-4 text-gray-400 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                        {(post.author || "S")[0]}
                                    </div>
                                    {post.author || "System"}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleStatus(post.id, post.status)}
                                        className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${post.status === "published"
                                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                                            }`}>
                                        {post.status}
                                    </button>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:text-white hover:bg-white/10 rounded"><Eye size={16} /></button>
                                        <button className="p-2 hover:text-neon-cyan hover:bg-white/10 rounded"><Edit2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
