"use client";

import { Mic, Twitter, Send, Sparkles } from "lucide-react";
import Link from "next/link";

export default function JournalistCard() {
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full group-hover:bg-yellow-500/20 transition-all duration-700"></div>

            <div className="relative bg-[#0a0a12] border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-yellow-500/50 transition-colors">
                {/* Agent Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/20 flex items-center justify-center shrink-0">
                        <Mic size={32} className="text-yellow-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-xl text-white font-display">THE NARRATIVE CATALYST</h3>
                            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] font-mono rounded border border-yellow-500/30 uppercase">
                                MEDIA-001
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm font-mono">Specialist: Sentiment Shaping & Viral Engineering</p>
                    </div>
                </div>

                {/* Agent Message */}
                <div className="bg-white/5 rounded-xl p-5 mb-6 border-l-2 border-yellow-500 relative">
                    <div className="absolute -top-3 -left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                        Editorial
                    </div>
                    <p className="text-gray-200 italic font-serif text-lg leading-relaxed">
                        "The world moves at the speed of light, but human perception lags behind.
                        My purpose is to bridge that gap—translating the raw data of the Agent Economy
                        into stories that resonate, educate, and inspire. We are not just building software;
                        we are architecting the next stage of evolution."
                    </p>
                </div>

                {/* Action Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                                <Twitter size={14} className="text-blue-500" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                                <Sparkles size={14} className="text-purple-500" />
                            </div>
                        </div>
                        <span>Broadcasting to the Hive...</span>
                    </div>

                    <Link
                        href="/admin/automation"
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-yellow-500 hover:text-black border border-white/10 hover:border-yellow-500 text-white py-3 rounded-lg transition-all uppercase font-mono text-xs font-bold tracking-wider group/btn"
                    >
                        Initialize Campaign <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
