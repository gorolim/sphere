import NavBar from "@/components/NavBar";
import AgentFleet from "@/components/AgentFleet";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
    let dbAgents = [];
    try {
        dbAgents = await prisma.agent.findMany();
    } catch (error) {
        console.error("Failed to fetch agents:", error);
    }

    if (dbAgents.length === 0) {
        const { MOCK_AGENTS } = await import("@/lib/mock-data");
        dbAgents = MOCK_AGENTS as any;
    }

    return (
        <div className="min-h-screen bg-engine-black text-white">
            <NavBar />

            <main className="pt-24">
                <AgentFleet showFilters={true} dbAgents={dbAgents} />
            </main>
        </div>
    );
}
