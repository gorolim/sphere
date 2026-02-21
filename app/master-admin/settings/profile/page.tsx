import { User } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-96 text-red-500 font-mono font-bold">
                [ UNAUTHORIZED_ACCESS ]
            </div>
        );
    }

    // Fetch the full user document from the DB
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (!dbUser) {
        return (
            <div className="flex items-center justify-center h-96 text-yellow-500 font-mono font-bold">
                [ ERROR: USER_RECORD_NOT_FOUND_IN_MAINFRAME ]
            </div>
        );
    }

    return (
        <div className="flex-1 w-full bg-engine-background flex flex-col items-start p-8">
            <div className="mb-8 flex items-center justify-between w-full">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <User className="text-neon-cyan shrink-0" size={32} />
                        Profile Settings
                    </h1>
                    <p className="text-neon-cyan/80 font-mono mt-2">// OROBOROS_ONBOARDING_INITIALIZATION</p>
                    <p className="max-w-3xl text-gray-400 mt-4 leading-relaxed">
                        Claim your unique <code className="text-neon-purple font-mono">@username</code>, connect your social channels, and securely deposit your raw career & personal logs.
                        Nova will parse these logs to architect your public-facing Master Portfolio.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-4xl">
                <ProfileForm user={dbUser} />
            </div>
        </div>
    );
}
