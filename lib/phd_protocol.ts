import { AgentProfile } from "./brain";

// --- CORE DATA STRUCTURES ---

export type ThesisStatus = "pending" | "approved" | "rejected";

export interface DomainCharter {
    name: string;
    scope_in: string[];
    scope_out: string[];
    mandatory_methods: string[];
    forbidden_moves: string[];
}

export interface CorpusPack {
    facts: string[];
    principles: string[];
    controversies: string[];
}

export interface CandidateSubmission {
    task_id: string;
    raw_text: string;
    sections: Record<string, string>;
    timestamp: number;
}

export interface TrialResult {
    agent_id: string;
    scores: {
        depth: number;
        rigor: number;
        defense: number;
        integration: number;
        novelty: number;
        calibration: number;
        total: number;
    };
    passed: boolean;
    timestamp: string;
}

export interface Thesis {
    id: string;
    title: string;
    authors: {
        primary: string; // The PhD Candidate
        partners: string[]; // The Triad
    };
    domain_charter: string;
    abstract: string;
    content: {
        problem_statement: string;
        methodology: string;
        theoretical_integration: string; // From Triad
        results: string;
        limitations: string; // Mandatory
        conclusion: string;
    };
    citations: string[];
    status: ThesisStatus;
    metrics: {
        coherence: number;
        falsifiability: number;
        stability: number;
    };
    generated_at: string;
}

// --- LOGIC STUBS (Deterministic Simulation) ---

export function checkFailFast(sub: CandidateSubmission): string[] {
    const reasons: string[] = [];
    if (!sub.sections["Failure Modes"]) reasons.push("no_failure_modes");
    if (!sub.sections["Tests"]) reasons.push("no_tests_for_novel_claims");
    return reasons;
}

export function calculateTriadicCompatibility(agentA: AgentProfile, agentB: AgentProfile, agentC: AgentProfile): number {
    // Mock calculation of compatibility index
    return 0.85; // High enough to pass
}
