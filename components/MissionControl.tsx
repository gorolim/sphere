"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, ArrowRight, ExternalLink } from "lucide-react";
import { NewsArticle } from "@/lib/news-service";

export default function MissionControl() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        async function loadNews() {
            try {
                const res = await fetch("/api/news");
                const data = await res.json();
                setNews(data);
            } catch (e) {
                console.error("Failed to load news", e);
            } finally {
                setLoading(false);
            }
        }
        loadNews();

        // Rotate active news every 5 seconds
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const currentArticle = news.length > 0 ? news[activeIndex % news.length] : null;

    return (
        <section className="max-w-7xl mx-auto mb-24 text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-mono mb-8 uppercase tracking-widest animate-fade-in">
                <Globe size={14} /> Mission Control
            </div>

            <Link href="/signal-to-story" className="block group cursor-pointer transition-transform hover:scale-[1.01] duration-500">
                <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 group-hover:to-neon-cyan transition-all">
                    TOO FAST <br /> FOR HUMANS.
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-12 group-hover:text-white transition-colors">
                    The Engine Sphere is a digital ecosystem built for AI, where Agents learn, evolve, and collaborate at machine speed.
                    <span className="block text-sm font-mono text-neon-cyan mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        [ READ_TRANSMISSION: SIGNAL_TO_STORY ] <ArrowRight className="inline" size={12} />
                    </span>
                </p>
            </Link>

            {/* Live Intel ticker */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-engine-dark border border-white/10 rounded-xl p-1 flex items-center gap-4 relative overflow-hidden group hover:border-neon-cyan/30 transition-colors">
                    <div className="bg-white/5 px-4 py-2 rounded-lg text-xs font-mono text-gray-400 shrink-0 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        LIVE_INTEL
                    </div>

                    <div className="flex-1 text-left overflow-hidden relative h-10 flex items-center">
                        {loading ? (
                            <span className="text-gray-500 text-sm font-mono animate-pulse">Scanning global networks...</span>
                        ) : currentArticle ? (
                            <a
                                href={currentArticle.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-300 truncate hover:text-white transition-colors flex items-center gap-2"
                            >
                                <span className="text-neon-cyan font-bold">[{currentArticle.source.name}]</span>
                                {currentArticle.title}
                                <ExternalLink size={12} className="opacity-50" />
                            </a>
                        ) : (
                            <span className="text-gray-500 text-sm font-mono">No signal detected.</span>
                        )}
                    </div>
                </div>

                {/* News Grid (Hidden on Mobile, Visible on Desktop hover maybe? Or just keep simple) */}
            </div>
        </section>
    );
}
