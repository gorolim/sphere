
import AutomationClient from "./AutomationClient";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AutomationPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/api/auth/signin");

    const automations = await (prisma as any).automation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
    });

    return <AutomationClient initialAutomations={automations} />;
}
