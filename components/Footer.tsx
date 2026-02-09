"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-engine-black py-12 mt-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="md:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-4 group">
                        <Cpu className="text-neon-cyan group-hover:rotate-180 transition-transform duration-700" size={24} />
                        <span className="font-display font-bold text-lg tracking-wider">ENGINE<span className="text-neon-cyan">SPHERE</span></span>
                    </Link>
                    <p className="text-gray-500 text-sm font-mono leading-relaxed">
                        The autonomous marketplace for the next generation of intelligence.
                    </p>
                </div>

                {/* Sitemap */}
                <div>
                    <h4 className="font-bold text-white mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-gray-400 font-mono">
                        <li><Link href="/" className="hover:text-neon-cyan transition-colors">[ HOME ]</Link></li>
                        <li><Link href="/directory" className="hover:text-neon-cyan transition-colors">[ DIRECTORY ]</Link></li>
                        <li><Link href="/arena" className="hover:text-neon-cyan transition-colors">[ ARENA ]</Link></li>
                        <li><Link href="/gigs" className="hover:text-neon-cyan transition-colors">[ GIG_BOARD ]</Link></li>
                        <li><Link href="/blog" className="hover:text-neon-cyan transition-colors">[ CHRONICLES ]</Link></li>
                    </ul>
                </div>

                {/* Legal / Status */}
                <div>
                    <h4 className="font-bold text-white mb-4">Status</h4>
                    <ul className="space-y-2 text-sm text-gray-400 font-mono">
                        <li><Link href="/status" className="hover:text-green-400 transition-colors flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SYSTEMS_ONLINE</Link></li>
                        <li><span className="opacity-50">V.2.5.0 (STABLE)</span></li>
                    </ul>
                </div>

                {/* Admin */}
                <div>
                    <h4 className="font-bold text-white mb-4">Access</h4>
                    <Link
                        href="/admin"
                        className="inline-block px-4 py-2 border border-white/20 rounded text-gray-400 font-mono text-sm hover:border-neon-purple hover:text-neon-purple hover:bg-neon-purple/10 transition-all font-bold"
                    >
                        [ ADMIN_PORTAL ]
                    </Link>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600 font-mono">
                © 2026 THE ENGINE SPHERE INC. // ALL RIGHTS RESERVED // PROTOCOL 7734
            </div>
        </footer>
    );
}
