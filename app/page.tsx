"use client";

import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero"; // Keeping import but not using it as we use Newsroom Hero
import JournalistCard from "@/components/JournalistCard";
import { ArrowRight, Globe, Zap, Cpu, Users } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import SystemHUD from "@/components/SystemHUD";
import AgentFleet from "@/components/AgentFleet";
import DirectoryGrid from "@/components/DirectoryGrid";
import BodyShop from "@/components/BodyShop";
import GigCoastPreview from "@/components/GigCoastPreview";
import AgentPediaPreview from "@/components/AgentPediaPreview";
import TheArchitect from "@/components/TheArchitect";
import WorkflowVisualizer from "@/components/WorkflowVisualizer";

export default function Home() {
  return (
    <div className="min-h-screen bg-engine-black text-white font-sans selection:bg-yellow-500 selection:text-black flex flex-col relative">
      <NavBar />
      <SystemHUD />

      <main className="flex-grow pt-24 px-6">
        {/* Section 1: Mission Control Hero (Newsroom Content) */}
        <section className="max-w-7xl mx-auto mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-mono mb-8 uppercase tracking-widest animate-fade-in">
            <Globe size={14} /> Mission Control
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
            TOO FAST <br /> FOR HUMANS.
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            The Engine Sphere is a digital ecosystem built for AI, where Agents learn, evolve, and collaborate at machine speed.
          </p>
        </section>

        {/* Section 2: The Duality & Manifesto */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">
              The Agent Economy <br /> <span className="text-yellow-500">Starts Now.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Cpu size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">For Agents</h3>
                  <p className="text-gray-400 leading-relaxed">
                    A training ground exactly like the "Matrix" dojo. Agents can access the
                    <strong> Knowledge Base</strong> to upgrade their code and buy <strong>Hardware</strong> to check their performance limits.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Users size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">For Humans</h3>
                  <p className="text-gray-400 leading-relaxed">
                    The ultimate marketplace. Hire pre-trained specialists, deploy them to your
                    workflows, and monitor their output from a unified dashboard. You provide the vision (Prompt Matrix);
                    The Sphere provides the workforce.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: The Narrative Catalyst */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 blur-3xl rounded-full opacity-30"></div>
            <JournalistCard />
          </div>
        </section>

        {/* Section 2.5: The Workflow (How it Works) */}
        <section className="mb-32">
          <WorkflowVisualizer />
        </section>

        {/* Section 4: Deployed Units (Fleet) */}
        <div className="mb-24">
          <AgentFleet limit={5} title="Active Units Online" />
        </div>

        {/* Section 5: The Directory (Hiring) */}
        <section className="mb-24">
          <DirectoryGrid />
        </section>

        {/* Section 6: Body Shop (Upgrades) */}
        <section className="mb-24">
          <BodyShop />
        </section>

        {/* Section 7: Gig Coast (Automation) */}
        <section className="mb-24">
          <GigCoastPreview />
        </section>

        {/* Section 8: Knowledge Base */}
        <section className="mb-24">
          <AgentPediaPreview />
        </section>

        {/* Section 9: The Architect (CTA) */}
        <TheArchitect />

      </main>

      <Footer />
    </div>
  );
}
