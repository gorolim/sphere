
import NavBar from "@/components/NavBar";
import CheckoutModal from "@/components/CheckoutModal";
import { CheckCircle, XCircle, Radio, Database, PenTool, Zap, ArrowRight } from "lucide-react";
import { checkSubscription } from "@/lib/subscription";

export default async function PricingPage() {
    let isPro = false;
    try {
        isPro = await checkSubscription();
    } catch (e) {
        console.error("Failed to check subscription:", e);
    }

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans selection:bg-neon-cyan selection:text-black">
            <NavBar />

            <main className="pt-32 pb-12 px-6">

                {/* Signal to Story Content */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-xs font-mono mb-8">
                        <Radio size={14} className="animate-pulse" />
                        <span>TRANSMISSION_RECEIVED</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                        FROM <span className="text-neon-cyan">SIGNAL</span> <br />
                        TO <span className="text-purple-500">STORY</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-16">
                        The Engine Sphere isn't just a database. It's a living, breathing content refinery. Here is how raw data becomes a compelling narrative.
                    </p>

                    {/* The Process Visualizer */}
                    <div className="max-w-6xl mx-auto mb-32 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-purple-500 to-yellow-500 -z-10 hidden md:block"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {/* Step 1 */}
                            <div className="bg-engine-black p-8 border border-neon-cyan/30 rounded-2xl relative group hover:-translate-y-2 transition-transform duration-500">
                                <div className="w-20 h-20 bg-engine-black border-2 border-neon-cyan rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                                    <Database size={32} className="text-neon-cyan" />
                                </div>
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-engine-black px-4 font-mono text-neon-cyan text-sm">STEP_01</div>
                                <h3 className="text-2xl font-bold font-display mb-4">The Signal</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Our autonomous agents scan the digital horizon 24/7. They detect weak signals, emerging trends, and raw data points before they hit the mainstream.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-engine-black p-8 border border-purple-500/30 rounded-2xl relative group hover:-translate-y-2 transition-transform duration-500 delay-100">
                                <div className="w-20 h-20 bg-engine-black border-2 border-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                    <Zap size={32} className="text-purple-500" />
                                </div>
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-engine-black px-4 font-mono text-purple-500 text-sm">STEP_02</div>
                                <h3 className="text-2xl font-bold font-display mb-4">The Synthesis</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    In The Hive, specialized agents analyze the signals. They check facts, cross-reference history, and simulate outcomes to distill the noise into pure insight.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-engine-black p-8 border border-yellow-500/30 rounded-2xl relative group hover:-translate-y-2 transition-transform duration-500 delay-200">
                                <div className="w-20 h-20 bg-engine-black border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                                    <PenTool size={32} className="text-yellow-500" />
                                </div>
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-engine-black px-4 font-mono text-yellow-500 text-sm">STEP_03</div>
                                <h3 className="text-2xl font-bold font-display mb-4">The Story</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Final output. Optimized for impact, ready for distribution. Whether it's a blog post, a newsletter, or a strategic report, it's crafted to resonate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/10 blur-[100px] rounded-full -z-10"></div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        BECOME AN <span className="text-neon-cyan">ARCHITECT</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Observers only see the final story. Architects control the signals.
                        <br />Unlock the full potential of The Engine Sphere.
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
