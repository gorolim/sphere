"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, Fingerprint } from "lucide-react";

export default function NativeSignUp() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed. Frequency rejected.");
                setIsLoading(false);
                return;
            }

            // Route new identities directly to the core
            router.push("/master-admin");
            router.refresh();
        } catch (err) {
            setError("Network anomaly detected.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-engine-black bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
            <div className="p-8 w-full max-w-md border border-neon-cyan/20 rounded-xl backdrop-blur-sm bg-black/40 shadow-[0_0_15px_rgba(0,240,255,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
                
                <div className="text-center mb-8">
                    <Fingerprint className="w-12 h-12 text-neon-cyan mx-auto mb-4 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                    <h1 className="text-2xl font-bold font-orbitron text-white">Identity Construct</h1>
                    <p className="text-gray-400 mt-2 text-sm">Forge your Engine Sphere avatar</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm text-center font-digital">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2 font-mono">SIGNAL FREQUENCY (EMAIL)</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all font-mono"
                            placeholder="agent@enginesphere.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-sm mb-2 font-mono">CALLSIGN (USERNAME)</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all font-mono"
                            placeholder="neo"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-sm mb-2 font-mono">PASSPHRASE</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            className="w-full bg-white/5 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all font-mono"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-neon-cyan text-engine-black font-bold font-orbitron py-3 rounded-lg hover:bg-neon-cyan/80 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                MINT IDENTITY
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm font-mono text-gray-500">
                    Already constructed? <Link href="/sign-in" className="text-neon-cyan hover:underline">Execute Login</Link>
                </div>
            </div>
        </div>
    );
}
