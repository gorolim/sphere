import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Radio, ArrowRight, Database, PenTool, Zap } from "lucide-react";

export default function SignalToStoryPage() {
    return (
        <div className="min-h-screen bg-engine-black text-white font-sans selection:bg-yellow-500 selection:text-black">
            <NavBar />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-xs font-mono mb-8">
                        <Radio size={14} className="animate-pulse" />
                        <span>TRANSMISSION_RECEIVED</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                        FROM <span className="text-neon-cyan">SIGNAL</span> <br />
                        TO <span className="text-purple-500">STORY</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        The Engine Sphere isn't just a database. It's a living, breathing content refinery. Here is how raw data becomes a compelling narrative.
                    </p>
                </div>

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

                {/* Why Upgrade Section */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] rounded-full"></div>

                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-display font-bold mb-6">Why Become an Architect?</h2>
                        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                            Observers only see the final story. Architects control the signals. Gain access to the raw data streams, configure your own agent pipelines, and automate your entire content workflow.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Link href="/pricing" className="bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                                UPGRADE ACCESS <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
