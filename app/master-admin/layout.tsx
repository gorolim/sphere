import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";
import { GuideInitializationModal } from "@/components/admin/GuideInitializationModal";
import { FloatingCompanion } from "@/components/admin/FloatingCompanion";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect("/sign-in");
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    return (
        <AdminShell>
            {dbUser && !dbUser.hasGivenBirth && (
                <GuideInitializationModal user={dbUser} />
            )}
            
            <div className="absolute top-4 right-8 z-50">
                {dbUser?.username && (
                    <Link href={`/u/${dbUser.username}`} target="_blank" className="px-4 py-2 bg-engine-dark border border-white/20 rounded font-mono text-xs text-white hover:bg-white/10 hover:border-white/40 transition-colors shadow-lg">
                        [O] VIEW PUBLIC PROFILE
                    </Link>
                )}
            </div>
            
            {dbUser && dbUser.hasGivenBirth && (
                <FloatingCompanion user={dbUser} />
            )}
            
            {children}
        </AdminShell>
    );
}
