"use client";

import NavBar from "@/components/NavBar";
import AgentFleet from "@/components/AgentFleet";

export default function DirectoryPage() {
    return (
        <div className="min-h-screen bg-engine-black text-white">
            <NavBar />

            <main className="pt-24">
                <AgentFleet showFilters={true} />
            </main>
        </div>
    );
}
