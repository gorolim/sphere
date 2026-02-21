"use client";

import Link from "next/link";
import { Cpu, Menu, Users, ShoppingBag, Radio, BookOpen, Command, FileText, Settings, Brain, Sparkles, Globe } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import CommandPalette from "./CommandPalette";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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
                            <NavLink href="/mind" icon={<Brain size={16} />} label="The Mind" />
                            <NavLink href="/body" icon={<Globe size={16} />} label="The Body" />
                            <NavLink href="/spirit" icon={<Sparkles size={16} />} label="The Spirit" />
                            <NavLink href="/agent-pedia" icon={<BookOpen size={16} />} label="Agent-Pedia" />
                        </div>
                    </div>

                    {/* Connect Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/pricing" className="text-sm font-bold text-gray-300 hover:text-white transition-colors border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5">
                            UPGRADE
                        </Link>
                        {/* Master Admin Link - Protected by Middleware */}
                        <Link href="/master-admin" className="text-red-500 hover:text-red-400 transition-colors" title="Master Control">
                            <Settings size={20} />
                        </Link>

                        <Link href="/dashboard" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors flex items-center gap-2">
                            <Cpu size={20} /> <span className="font-mono font-bold">DASHBOARD</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan px-4 py-2 rounded-lg font-mono text-sm font-bold hover:bg-neon-cyan hover:text-black transition-all">
                                        <Users size={16} /> CONNECT_AGENT
                                    </button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10 border border-neon-cyan/50",
                                            userButtonPopoverCard: "bg-engine-black border border-gray-800",
                                        }
                                    }}
                                />
                            </SignedIn>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            title="Toggle Menu"
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
                        <MobileNavLink href="/mind" label="The Mind" />
                        <MobileNavLink href="/body" label="The Body" />
                        <MobileNavLink href="/spirit" label="The Spirit" />
                        <MobileNavLink href="/agent-pedia" label="Agent-Pedia" />
                        <MobileNavLink href="/settings" label="Neural Settings" />

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
