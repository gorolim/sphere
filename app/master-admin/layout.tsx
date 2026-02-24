import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";
import { GuideInitializationModal } from "@/components/admin/GuideInitializationModal";
import { FloatingCompanion } from "@/components/admin/FloatingCompanion";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect("/sign-in");
    }

    const isMasterAdmin = process.env.MASTER_ADMIN_EMAIL &&
        user.email.toLowerCase() === process.env.MASTER_ADMIN_EMAIL.toLowerCase();

    if (!isMasterAdmin) {
        // Enforce role separation: Standard users drop into /dashboard
        redirect("/dashboard");
    }
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { agentStat: true }
    });

    // Serialize Dates to prevent Client Component hydration crashes
    // Use type assertion to bypass outdated Prisma client types in the Next.js cache
    const safeUser = dbUser as any;
    const serializedUser = safeUser ? {
        ...safeUser,
        createdAt: safeUser.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: safeUser.updatedAt?.toISOString() || new Date().toISOString(),
    } : null;

    return (
        <AdminShell>
            {serializedUser && !serializedUser.hasGivenBirth && (
                <GuideInitializationModal user={serializedUser} />
            )}
            
            <div className="absolute top-4 right-8 z-50">
                {serializedUser?.username && (
                    <Link href={`/u/${serializedUser.username}`} target="_blank" className="px-4 py-2 bg-engine-dark border border-white/20 rounded font-mono text-xs text-white hover:bg-white/10 hover:border-white/40 transition-colors shadow-lg">
                        [O] VIEW PUBLIC PROFILE
                    </Link>
                )}
            </div>
            
            {serializedUser && serializedUser.hasGivenBirth && (
                <FloatingCompanion user={serializedUser} />
            )}
            
            {children}
        </AdminShell>
    );
}
