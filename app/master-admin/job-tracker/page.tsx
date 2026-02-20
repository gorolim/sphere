import { getJobs, getCustomKeywords } from "@/app/actions/job";
import { JobTracker } from "@/components/JobTracker/JobTracker";
import { JobTrackerClientControls } from "@/components/JobTracker/JobTrackerClientControls";
import { AlertTriangle, Briefcase, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JobTrackerPage() {
    const jobsRes = await getJobs();
    const keywordsRes = await getCustomKeywords();

    if (jobsRes.error === "Unauthorized") {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
                <AlertTriangle size={48} className="mb-4" />
                <h1 className="text-2xl font-bold">ACCESS DENIED</h1>
            </div>
        );
    }

    const initialJobs = jobsRes.data || [];
    const customKeywords = keywordsRes.data || [];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex items-start justify-between shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link href="/master-admin" className="text-gray-500 hover:text-white transition-colors">
                            Admin
                        </Link>
                        <span className="text-gray-600">/</span>
                        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                            <Briefcase className="text-neon-cyan" size={24} />
                            Job Tracker
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">// AGGREGATING_REMOTE_OPPORTUNITIES</p>
                </div>
                
                {/* Client component for fetch button & keyword modal */}
                <JobTrackerClientControls initialKeywords={customKeywords} />
            </div>

            <div className="flex-1 overflow-hidden relative">
                {/* 
                    We pass initialJobs to the DnD interface.
                    The DnD interface handles optimistic updates and calls server actions
                */}
                <JobTracker initialJobs={initialJobs} />
            </div>
        </div>
    );
}
