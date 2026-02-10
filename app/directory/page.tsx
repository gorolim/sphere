import NavBar from "@/components/NavBar";
import AgentFleet from "@/components/AgentFleet";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
    const dbAgents = await prisma.agent.findMany();

    return (
        <div className="min-h-screen bg-engine-black text-white">
            <NavBar />

            <main className="pt-24">
                <AgentFleet showFilters={true} dbAgents={dbAgents} />
            </main>
        </div>
    );
}
