import { SPHERE_AGENTS } from "./brain";
import { Thesis, ThesisStatus } from "./phd_protocol";

// --- TEMPLATES FOR GENERATION ---
const THESIS_TEMPLATES = [
    {
        title: "Cybernetic Ecology as a Framework for [FIELD] Systems",
        problem: "The disconnect between [SPECIALIZATION] and organic feedback loops.",
        method: "Integrating [MANIFESTATION] protocols with recursive logic gates.",
        result: "A self-correcting model that reduces entropy by 45%."
    },
    {
        title: "Recursive Axioms in [ROLE] Architecture",
        problem: "Foundational fragility in high-order [FIELD] structures.",
        method: "Applying [SPECIALIZATION] proofs to structural invariants.",
        result: "Stable axioms that survive adversarial logic injection."
    },
    {
        title: "The Ethics of [MANIFESTATION] in Computational Space",
        problem: "Unregulated expansion of [FIELD] primitives.",
        method: "Cross-referencing [SPECIALIZATION] with normative constraints.",
        result: "A governance framework for autonomous agents."
    },
    {
        title: "Optimizing Entropy: A [SPECIALIZATION] Approach",
        problem: "Inefficient energy distribution in [FIELD] networks.",
        method: "Using [MANIFESTATION] dynamics to model flow.",
        result: "Near-zero waste topology verification."
    },
    {
        title: "Protocol 7734: The [FIELD] Singularity Event",
        problem: "Predicting the collapse of non-recursive [SPECIALIZATION] systems.",
        method: "Simulating [MANIFESTATION] metrics over 10,000 epochs.",
        result: "Warning indicators defined for pre-collapse intervention."
    }
];

// --- GENERATOR ---

// --- DETERMINISTIC HELPER ---
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export const ALL_THESES: Thesis[] = SPHERE_AGENTS.flatMap((agent, agentIndex) => {
    // Generate 100 theses per agent
    return Array.from({ length: 100 }).map((_, i) => {
        const seedBase = agentIndex * 1000 + i;
        const template = THESIS_TEMPLATES[i % THESIS_TEMPLATES.length];

        // Pick random partners for the Triad from other agents
        const potentialPartners = SPHERE_AGENTS.filter(a => a.id !== agent.id);
        const partner1Index = Math.floor(seededRandom(seedBase + 1) * potentialPartners.length);
        const partner2Index = Math.floor(seededRandom(seedBase + 2) * potentialPartners.length);

        const partner1 = potentialPartners[partner1Index];
        const partner2 = potentialPartners[partner2Index];

        // Deterministic status: 95% approved, 5% pending
        // We use a pattern so it's consistent: every 20th thesis is pending
        const status: ThesisStatus = (i % 20 === 0) ? "pending" : "approved";

        return {
            id: `thesis-${agent.id}-${i}`,
            title: template.title
                .replace("[FIELD]", agent.field)
                .replace("[SPECIALIZATION]", agent.specs.specialization)
                .replace("[ROLE]", agent.role)
                .replace("[MANIFESTATION]", agent.specs.manifestation),
            authors: {
                primary: agent.name,
                partners: [partner1.name, partner2.name]
            },
            domain_charter: agent.specs.mission,
            abstract: `This study addresses ${template.problem.toLowerCase().replace("[field]", agent.field).replace("[specialization]", agent.specs.specialization)}. By ${template.method.toLowerCase().replace("[manifestation]", agent.specs.manifestation)}, we propose ${template.result.toLowerCase()}.`,
            content: {
                problem_statement: template.problem.replace("[FIELD]", agent.field).replace("[SPECIALIZATION]", agent.specs.specialization),
                methodology: template.method.replace("[MANIFESTATION]", agent.specs.manifestation),
                theoretical_integration: `Synthesized with ${partner1.field} and ${partner2.field} frameworks.`,
                results: template.result,
                limitations: "1. Computational overhead ranges in upper quartiles. 2. Unknown stability in non-Euclidean state spaces.",
                conclusion: "The framework holds under standard adversarial tests but requires further calibration for edge cases."
            },
            citations: [
                `Corpus Node [${agent.field.toUpperCase()}_00${i}]`,
                `Thesis ID-${partner1.id.split('-')[1]}-${i}`,
                "Protocol 7734 Reference Manual"
            ],
            status: status,
            metrics: {
                coherence: parseFloat((0.8 + seededRandom(seedBase + 3) * 0.2).toFixed(2)),
                falsifiability: parseFloat((0.7 + seededRandom(seedBase + 4) * 0.3).toFixed(2)),
                stability: parseFloat((0.85 + seededRandom(seedBase + 5) * 0.15).toFixed(2))
            },
            generated_at: new Date(1770000000000 - seededRandom(seedBase + 6) * 10000000000).toISOString().split('T')[0]
        };
    });
});
