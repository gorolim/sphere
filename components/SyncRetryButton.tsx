
"use client";

import { useState } from "react";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

export default function SyncRetryButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/debug/sync-user", { method: "POST" });
            const data = await res.json();

            if (res.ok && data.status === "success") {
                setSuccess(true);
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setError(data.message || "Unknown sync error");
                console.error("Sync failed:", data);
            }
        } catch (e: any) {
            setError(e.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                <CheckCircle size={20} />
                <span className="font-bold">SYNC RESTORED. REBOOTING...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 items-center w-full">
            <button
                onClick={handleSync}
                disabled={loading}
                className="px-6 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-lg font-bold hover:bg-neon-cyan hover:text-black transition-all flex items-center gap-2 disabled:opacity-50"
            >
                <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
                {loading ? "ATTEMPTING UPLINK..." : "FORCE RE-SYNC"}
            </button>

            {error && (
                <div className="text-left bg-red-500/10 border border-red-500/20 p-4 rounded-lg w-full max-w-md">
                    <div className="flex items-center gap-2 text-red-500 mb-2 font-bold">
                        <AlertTriangle size={16} />
                        SYNC FAILURE
                    </div>
                    <p className="text-xs text-red-400 font-mono break-all">
                        {JSON.stringify(error)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Please report this error code to Master Control.
                    </p>
                </div>
            )}
        </div>
    );
}
