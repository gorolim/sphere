"use client";

import NavBar from "@/components/NavBar";
import { CheckCircle, Circle, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const TASKS = [
    { id: 1, title: "Senior Market Specialist (Real/Simulated Results)", status: "done", link: "/admin/agents/market-researcher", note: "See 'Trigger Run' in Admin" },
    { id: 2, title: "Home Page Agent (The Architect) Provisioning", status: "done", link: "/", note: "Chat at bottom-right. Ask: 'I want a robot...'" },
    { id: 3, title: "Hardware Sourcing (API Mock -> BodyShop)", status: "done", link: "/#bodyshop", note: "Products now served from 'Big Brain'" },
    { id: 4, title: "The Journalist (Daily Digest Agent)", status: "done", link: "/admin/newsroom", note: "Trigger in Newsroom" },
    { id: 5, title: "Social Media Manager (Instagram)", status: "done", link: "/admin/newsroom", note: "Auto-triggers after Journalist" },
    { id: 6, title: "Social Media Manager (YouTube)", status: "done", link: "/admin/newsroom", note: "Auto-triggers after Journalist" },
    { id: 7, title: "Public Blog Page", status: "done", link: "/blog", note: "Displays the output of The Journalist" },
    { id: 8, title: "Directory / Matching Page", status: "done", link: "/directory", note: "Filterable agent list" },
    { id: 9, title: "Crypto Wallet Connection", status: "done", link: "/", note: "Top right of NavBar" },
];

export default function StatusPage() {
    return (
        <div className="min-h-screen bg-engine-black text-white font-sans">
            <NavBar />

            <main className="pt-24 px-6 max-w-4xl mx-auto">
                <div className="mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-display font-bold mb-2">Development Status Log</h1>
                    <p className="font-mono text-neon-cyan text-sm">[ LIVE_DEPLOYMENT_TRACKER ]</p>
                </div>

                <div className="space-y-4">
                    {TASKS.map((task) => (
                        <div key={task.id} className="bg-engine-dark border border-white/10 p-6 rounded-xl flex items-center justify-between group hover:border-neon-cyan/50 transition-all">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 ${task.status === "done" ? "text-green-500" : "text-gray-500"}`}>
                                    {task.status === "done" ? <CheckCircle size={20} /> : <Circle size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-neon-cyan transition-colors">{task.title}</h3>
                                    <p className="text-gray-400 text-sm font-mono mt-1">{task.note}</p>
                                </div>
                            </div>

                            <Link href={task.link} className="flex items-center gap-2 bg-white/5 hover:bg-neon-cyan hover:text-black px-4 py-2 rounded text-sm font-bold transition-all">
                                VERIFY <ExternalLink size={14} />
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm text-gray-300">
                    <p className="font-bold text-blue-400 mb-2">💡 Troubleshooting</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>If features are missing, try a strictly <strong>Hard Refresh</strong> (Ctrl+F5).</li>
                        <li>Ensure you are viewing <strong>localhost:3000</strong>.</li>
                        <li>The "Architect" chat button is in the <strong>bottom-right corner</strong>.</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
