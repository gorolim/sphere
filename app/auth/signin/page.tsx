"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Cpu, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Access Denied: Invalid Credentials");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen bg-engine-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-engine-dark border border-white/10 p-8 rounded-2xl shadow-neon relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-white to-neon-purple" />

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border border-white/20 mb-4 animate-pulse">
                        <Cpu className="text-neon-cyan" size={32} />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white tracking-widest">SYSTEM ACCESS</h1>
                    <p className="text-xs font-mono text-gray-500 uppercase mt-2">Restricted Area // Level 5 Clearance</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-neon-cyan mb-2 flex items-center gap-2">
                            <Lock size={12} /> ENTER PASSPHRASE
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                            placeholder="••••••••••••"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs font-mono text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg font-bold font-display tracking-widest uppercase transition-all ${loading
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "bg-white text-black hover:bg-neon-cyan hover:shadow-neon"
                            }`}
                    >
                        {loading ? "AUTHENTICATING..." : "INITIATE SESSION"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-600 font-mono">
                        UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED AND REPORTED TO THE ARCHITECT.
                    </p>
                </div>
            </div>
        </div>
    );
}
