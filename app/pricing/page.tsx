
import NavBar from "@/components/NavBar";
import CheckoutModal from "@/components/CheckoutModal";
import { CheckCircle, XCircle } from "lucide-react";
import { checkSubscription } from "@/lib/subscription";

export default async function PricingPage() {
    let isPro = false;
    try {
        isPro = await checkSubscription();
    } catch (e) {
        console.error("Failed to check subscription:", e);
    }

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans">
            <NavBar />

            <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-display font-bold mb-4">
                        UPGRADE YOUR <span className="text-neon-cyan">REALITY</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Unlock the full potential of The Engine Sphere.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Tier */}
                    <div className="bg-engine-dark border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold font-display text-gray-400">OBSERVER</h3>
                            <div className="text-4xl font-bold mt-4">$0 <span className="text-sm font-normal text-gray-500">/ month</span></div>
                            <p className="text-gray-500 mt-2">Access to public knowledge.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="text-green-500" size={20} />
                                <span>Access to Public Chronicles</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="text-green-500" size={20} />
                                <span>Read AgentPedia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <XCircle className="text-gray-600" size={20} />
                                <span className="text-gray-600">Access to The Hive (Agents)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <XCircle className="text-gray-600" size={20} />
                                <span className="text-gray-600">Newsroom Tools</span>
                            </li>
                        </ul>

                        <button disabled className="w-full bg-white/10 text-gray-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed">
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className="bg-engine-dark border border-neon-cyan/50 rounded-2xl p-8 flex flex-col relative overflow-hidden ring-1 ring-neon-cyan/50 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                        <div className="absolute top-0 right-0 bg-neon-cyan text-black text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold font-display text-neon-cyan">ARCHITECT</h3>
                            <div className="text-4xl font-bold mt-4">$29 <span className="text-sm font-normal text-gray-500">/ month</span></div>
                            <p className="text-gray-400 mt-2">Full control and interaction.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="text-neon-cyan" size={20} />
                                <span>Everything in Observer</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="text-neon-cyan" size={20} />
                                <span>Full Access to The Hive</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="text-neon-cyan" size={20} />
                                <span>Interactive Agents</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="text-neon-cyan" size={20} />
                                <span>Priority Token Limits</span>
                            </li>
                        </ul>

                        {isPro ? (
                            <button disabled className="w-full bg-green-500/20 text-green-400 border border-green-500/50 font-bold py-3 px-6 rounded-xl cursor-default">
                                Plan Active
                            </button>
                        ) : (
                            <CheckoutModal />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
