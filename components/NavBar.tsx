"use client";

import Link from "next/link";
import { Cpu, Menu, Users, ShoppingBag, Radio, BookOpen, Command, FileText } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import WalletConnect from "./WalletConnect";
import CommandPalette from "./CommandPalette";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-engine-black/80 backdrop-blur-md border-b border-white/10">
            <CommandPalette />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
                        <Cpu className="h-8 w-8 text-neon-cyan animate-pulse group-hover:rotate-90 transition-transform duration-500" />
                        <span className="font-display font-bold text-2xl tracking-wider text-white">
                            ENGINE<span className="text-neon-cyan">SPHERE</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            <NavLink href="/directory" icon={<Users size={16} />} label="Directory" />
                            <NavLink href="/agent-pedia" icon={<BookOpen size={16} />} label="Agent-Pedia" />
                            <NavLink href="/fleet" icon={<Cpu size={16} />} label="My Fleet" />
                            <NavLink href="/blog" icon={<FileText size={16} />} label="Chronicles" />
                            <Link href="/arena" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                                <Radio size={16} /> ARENA GIGS
                            </Link>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <div className="hidden md:block">
                        <WalletConnect />
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-engine-dark p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            <Menu />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-engine-black border-b border-white/10"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink href="/directory" label="The Directory" />
                        <MobileNavLink href="/agent-pedia" label="Agent-Pedia" />
                        <MobileNavLink href="/fleet" label="My Fleet" />
                        <MobileNavLink href="/arena" label="Arena Gigs" />
                        <MobileNavLink href="/blog" label="Sphere Chronicles" />
                        <MobileNavLink href="/admin" label="Admin Console" />
                        <button className="w-full text-left mt-4 bg-engine-dark text-white font-mono px-4 py-3 rounded border border-neon-cyan/50">
                            [ CONNECT_NODE ]
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}

const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Link
        href={href}
        className="group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
    >
        <span className="text-neon-cyan group-hover:text-neon-purple transition-colors duration-300">{icon}</span>
        <span className="font-mono uppercase tracking-wide group-hover:shadow-neon">{label}</span>
    </Link>
);

const MobileNavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
        href={href}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
    >
        <span className="font-mono uppercase text-neon-cyan mr-2">{">"}</span>
        {label}
    </Link>
);
