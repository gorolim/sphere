"use client";

import { useState } from "react";
import { Save, User as UserIcon, Link2, FileText, CheckCircle2, Bot } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";

export function ProfileForm({ user }: { user: any }) {
    const [username, setUsername] = useState(user.username || "");
    const [socials, setSocials] = useState(user.socialHandles || { twitter: "", github: "", linkedin: "" });
    const [rawAbout, setRawAbout] = useState(user.rawAboutMe || "");
    const [rawPortfolio, setRawPortfolio] = useState(user.rawPortfolio || "");
    const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("saving");
        setMessage("");

        // Basic payload
        const payload = {
            username: username.replace("@", "").toLowerCase(),
            socialHandles: socials,
            rawAboutMe: rawAbout,
            rawPortfolio: rawPortfolio,
        };

        const res = await updateProfile(payload);
        if (res.error) {
            setStatus("error");
            setMessage(res.error);
        } else {
            setStatus("success");
            setMessage("Profile configuration saved successfully. Nova is analyzing the logs.");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-8">
            {/* Username Section */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                    <UserIcon size={18} className="text-neon-cyan" /> Identity / Username
                </h3>
                <p className="text-sm text-gray-400 mb-4">This will be your primary identifier (e.g., enginespherehub.com/u/yourname)</p>
                <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg px-4 py-2 focus-within:border-neon-cyan/50 transition-colors">
                    <span className="text-gray-500 font-mono">@</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="nova"
                        className="bg-transparent border-none outline-none text-white font-mono flex-1 lowercase"
                    />
                </div>
            </div>

            {/* Social Channels Context */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                    <Link2 size={18} className="text-neon-purple" /> Connect Channels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-2">TWITTER / X</label>
                        <input
                            type="text"
                            value={socials?.twitter || ""}
                            onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                            placeholder="https://x.com/username"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-neon-purple/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-2">LINKEDIN</label>
                        <input
                            type="text"
                            value={socials?.linkedin || ""}
                            onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-neon-purple/50"
                        />
                    </div>
                </div>
            </div>

            {/* Raw About Me */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl group-hover:bg-neon-cyan/10 transition-colors"></div>
                <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-neon-cyan" /> Raw 'About Me' Upload
                </h3>
                <p className="text-sm text-gray-400 mb-4">Dump your unstructured thoughts, history, and goals here. Nova will architect it into a cohesive narrative.</p>
                <textarea
                    value={rawAbout}
                    onChange={(e) => setRawAbout(e.target.value)}
                    placeholder="Where do I even begin? I was born..."
                    className="w-full h-48 bg-black/50 border border-white/10 rounded-lg p-4 text-white text-sm outline-none focus:border-neon-cyan/50 resize-y font-mono"
                />
            </div>

            {/* Raw Portfolio */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 rounded-full blur-3xl group-hover:bg-neon-purple/10 transition-colors"></div>
                <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-neon-purple" /> Raw Portfolio / CV
                </h3>
                <p className="text-sm text-gray-400 mb-4">Paste your raw CV, projects, statistics, and accomplishments. Nova will render this into your public portfolio grid.</p>
                <textarea
                    value={rawPortfolio}
                    onChange={(e) => setRawPortfolio(e.target.value)}
                    placeholder="- Project Alpha: scaled to 100k MAU
- Project Beta: built with Next.js and Prisma"
                    className="w-full h-48 bg-black/50 border border-white/10 rounded-lg p-4 text-white text-sm outline-none focus:border-neon-purple/50 resize-y font-mono"
                />
            </div>

            {/* Status & Submit */}
            <div className="flex items-center justify-between">
                <div>
                    {status === "error" && <p className="text-red-500 font-mono text-sm">{message}</p>}
                    {status === "success" && <p className="text-green-500 font-mono text-sm flex items-center gap-2"><CheckCircle2 size={16} /> {message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={status === "saving"}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    {status === "saving" ? (
                        <span className="flex items-center gap-2 animate-pulse"><Bot size={18} /> PROCESSING...</span>
                    ) : (
                        <span className="flex items-center gap-2"><Save size={18} /> SAVE CONFIGURATION</span>
                    )}
                </button>
            </div>
        </form>
    );
}
