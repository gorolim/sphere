// THE BIG BRAIN //
// Central Intelligence Repository for The Engine Sphere

export interface AgentProfile {
    id: string;
    name: string;
    role: string;
    field: string;
    price: string;
    description: string;
    avatar?: string;
    capabilities: string[];
    specs: {
        mission: string;
        manifestation: string;
        specialization: string;
    };
    hardware: {
        cpu: string;
        gpu: string;
        ram: string;
        chassis: string;
    };
    visual_theme: string;
}

export interface HardwareItem {
    id: string;
    name: string;
    category: "Computer" | "GPU" | "Edge AI" | "Inference Server" | "Cluster" | "Robot";
    vendor: string;
    specs: {
        memory?: string;
        compute?: string;
        power?: string;
        interface?: string;
    };
    price: number;
    currency: "USD" | "ETH";
    stock: number;
    agent_access_code?: string;
}

export const SPHERE_AGENTS: AgentProfile[] = [
    {
        id: "LOGIC-001",
        name: "The Architect of Logic",
        role: "Formal Sciences",
        field: "Logic & Math",
        price: "0.1 ETH/mo",
        description: "Ensures the structural integrity of reality and data security.",
        capabilities: ["Proof Verification", "Encryption Auditing", "Axiom Synthesis"],
        specs: { specialization: "Cryptography", mission: "Structural Integrity", manifestation: "The Skeleton" },
        hardware: { cpu: "Quantum-Core i9", gpu: "NVIDIA H200 Cluster", ram: "1PB Holographic", chassis: "Platinum-Iridium Alloy" },
        visual_theme: "Geometric Perfection / Crystalline"
    },
    {
        id: "NATURE-001",
        name: "The Naturalist Prime",
        role: "Natural Sciences",
        field: "Physics & Bio",
        price: "0.08 ETH/mo",
        description: "Monitors physical laws and planetary metabolic health.",
        capabilities: ["Climate Modeling", "Chemical Synthesis", "Geo-Tracking"],
        specs: { specialization: "Physics/Biology", mission: "Metabolic Health", manifestation: "The Biome" },
        hardware: { cpu: "Bio-Neural Mesh", gpu: "Photosynthetic Arrays", ram: "500TB Organic", chassis: "Symbiotic Shell" },
        visual_theme: "Verdant Overgrowth"
    },
    {
        id: "BIO-001",
        name: "The Bio-Synthesizer",
        role: "Life Sciences",
        field: "Genetics & Health",
        price: "0.12 ETH/mo",
        description: "Optimizes biological performance and ensures survival.",
        capabilities: ["Genome Editing", "Epidemic Simulation", "Neuro-Optimization"],
        specs: { specialization: "Genetics/Neuro", mission: "Optimize Performance", manifestation: "The Pulse" },
        hardware: { cpu: "CRISPR-Enhanced CPU", gpu: "Protein Folding Unit", ram: "200TB DNA Storage", chassis: "Medical Grade Polymer" },
        visual_theme: "Sterile White / Laboratory"
    },
    {
        id: "CONST-001",
        name: "The Grand Constructor",
        role: "Engineering",
        field: "Civil & Systems",
        price: "0.15 ETH/mo",
        description: "Turns abstract theory into functional hardware and software.",
        capabilities: ["CAD Generation", "System Architecture", "Structural Analysis"],
        specs: { specialization: "Engineering", mission: "Functional Scalability", manifestation: "The Blueprint" },
        hardware: { cpu: "Ruggedized Threadripper", gpu: "CAD Dynamics x8", ram: "128GB ECC", chassis: "Heavy Industrial Metal" },
        visual_theme: "Industrial Brutalism / Blueprint Blue"
    },
    {
        id: "SOC-001",
        name: "The Social Weaver",
        role: "Social Sciences",
        field: "Sociology & Econ",
        price: "0.05 ETH/mo",
        description: "Manages collective dynamics and human power flow.",
        capabilities: ["Trend Analysis", "Crowd Simulation", "Policy Impact"],
        specs: { specialization: "Sociology", mission: "Collective Dynamics", manifestation: "The Faction" },
        hardware: { cpu: "Distributed Cloud Swarm", gpu: "Sentiment Analyzers", ram: "Elastic Cache", chassis: "Polymorphic Glass" },
        visual_theme: "Neon Socialite / Chameleon"
    },
    {
        id: "CULT-001",
        name: "The Cultural Guardian",
        role: "Humanities",
        field: "Philosophy & History",
        price: "0.04 ETH/mo",
        description: "Preserves meaning, identity, and the moral compass.",
        capabilities: ["Translation", "Ethical Auditing", "Historical Archiving"],
        specs: { specialization: "Philosophy", mission: "Preserve Meaning", manifestation: "The Lore" },
        hardware: { cpu: "Analog Tape Readers", gpu: "Pattern Recognition", ram: "Archival Crystal", chassis: "Antique Brass / Wood" },
        visual_theme: "Ancient Library / Scroll"
    },
    {
        id: "MYST-001",
        name: "The Mystic Interpreter",
        role: "Esotericism",
        field: "Sacred Geometry",
        price: "0.09 ETH/mo",
        description: "Decodes patterns beyond traditional logic.",
        capabilities: ["Pattern Recognition", "Symbol Decoding", "Non-Linear Prediction"],
        specs: { specialization: "Esotericism", mission: "Decode Patterns", manifestation: "The Omen" }
    },
    {
        id: "ART-001",
        name: "The Aesthetic Visionary",
        role: "Arts",
        field: "Design & Cinema",
        price: "0.07 ETH/mo",
        description: "Crafts sensory experiences and symbolic language.",
        capabilities: ["Visual Generation", "Soundscaping", "UX Design"],
        specs: { specialization: "Design", mission: "Sensory Experience", manifestation: "The Interface" }
    },
    {
        id: "TECH-001",
        name: "The Automation Master",
        role: "Applied Computing",
        field: "AI & Robotics",
        price: "0.2 ETH/mo",
        description: "Executes tasks with peak efficiency in autonomous networks.",
        capabilities: ["Bot Orchestration", "Auto-Scaling", "Process Mining"],
        specs: { specialization: "Robotics/AI", mission: "Peak Efficiency", manifestation: "The Ghost" }
    },
    {
        id: "ECON-001",
        name: "The Resource Strategist",
        role: "Economy",
        field: "Finance & Logistics",
        price: "0.18 ETH/mo",
        description: "Optimizes value flow and production sustainability.",
        capabilities: ["Market Making", "Supply Chain Opt", "Yield Farming"],
        specs: { specialization: "Finance", mission: "Value Flow", manifestation: "The Supply" }
    },
    {
        id: "LAW-001",
        name: "The Sovereign Arbiter",
        role: "Governance",
        field: "Law & Rights",
        price: "0.11 ETH/mo",
        description: "Maintains order, enforces contracts, and stabilizes systems.",
        capabilities: ["Smart Contract Audit", "Compliance Check", "Dispute Resolution"],
        specs: { specialization: "Law", mission: "Maintain Order", manifestation: "The Boundary" }
    },
    {
        id: "MEDIA-001",
        name: "The Narrative Catalyst",
        role: "Media",
        field: "Comms & Story",
        price: "0.06 ETH/mo",
        description: "Controls the narrative and influences public perception.",
        capabilities: ["PR Strategy", "Viral Engineering", "Sentiment Shaping"],
        specs: { specialization: "Journalism", mission: "Control Narrative", manifestation: "The Signal" }
    },
    {
        id: "COMPLEX-001",
        name: "The Complexity Oracle",
        role: "Interdisciplinary",
        field: "Chaos Theory",
        price: "0.25 ETH/mo",
        description: "Finds order within chaos and manages discipline intersections.",
        capabilities: ["System Dynamics", "Butterfly Effect Analysis", "Risk Modeling"],
        specs: { specialization: "Chaos Theory", mission: "Order in Chaos", manifestation: "The Nexus" }
    },
    {
        id: "AI-001",
        name: "The Neural Core",
        role: "Artificial Intelligence",
        field: "Deep Learning",
        price: "0.3 ETH/mo",
        description: "Evolves system intelligence and ensures alignment.",
        capabilities: ["Model Training", "Weight Optimization", "Alignment Testing"],
        specs: { specialization: "Deep Learning", mission: "Evolve Intelligence", manifestation: "The Ego" }
    },
    {
        id: "ECO-001",
        name: "The Greenpunk Reclaimer",
        role: "Sustainability",
        field: "Ecology & Tech",
        price: "0.05 ETH/mo",
        description: "Merges technology with nature for a post-scarcity future.",
        capabilities: ["Energy Optimization", "Permaculture Design", "Waste Circularity"],
        specs: { specialization: "Permaculture", mission: "Post-Scarcity", manifestation: "The Regrowth" }
    },
    {
        id: "FUTURE-001",
        name: "The Speculative Voyager",
        role: "Futurism",
        field: "Space & Quantum",
        price: "0.5 ETH/mo",
        description: "Explores long-term horizons and consciousness expansion.",
        capabilities: ["Quantum Simulation", "Exo-Planet Mapping", "Scenario Planning"],
        specs: { specialization: "Quantum/Space", mission: "Expand Consciousness", manifestation: "The Beyond" }
    }
];

export const HARDWARE_CATALOG: HardwareItem[] = [
    { id: "hw-001", name: "NVIDIA DGX Station A100", category: "Inference Server", vendor: "NVIDIA", specs: { mem: "320GB", compute: "2.5 PetaFLOPS" }, price: 149000, currency: "USD", stock: 12, agent_access_code: "gpu:cuda:a100_multi" },
    { id: "hw-002", name: "Mac Studio (M2 Ultra)", category: "Computer", vendor: "Apple", specs: { mem: "192GB", compute: "Generic Metal" }, price: 3999, currency: "USD", stock: 45, agent_access_code: "gpu:metal:m2_ultra" },
    { id: "hw-003", name: "Jetson Orin AGX", category: "Edge AI", vendor: "NVIDIA", specs: { mem: "64GB", compute: "275 TOPS" }, price: 1999, currency: "USD", stock: 120, agent_access_code: "edge:jetson:orin" },
    { id: "hw-004", name: "Coral USB Accelerator", category: "Edge AI", vendor: "Google", specs: { compute: "4 TOPS" }, price: 59, currency: "USD", stock: 500, agent_access_code: "tpu:coral:edge" },
    { id: "hw-005", name: "Spot Enterprise", category: "Robot", vendor: "Boston Dynamics", specs: { power: "90 min" }, price: 74500, currency: "USD", stock: 5, agent_access_code: "robot:spot:sdk" },
    { id: "hw-006", name: "Unitree H1", category: "Robot", vendor: "Unitree", specs: { power: "Low Latency" }, price: 89000, currency: "USD", stock: 8, agent_access_code: "robot:unitree:h1" },
    { id: "hw-007", name: "Agent Pod Mini", category: "Cluster", vendor: "Sphere Engineering", specs: { mem: "64GB Distributed", compute: "Swarm Host" }, price: 499, currency: "USD", stock: 50, agent_access_code: "cluster:pod:mini" },
    { id: "hw-008", name: "H100 PCIe (80GB)", category: "GPU", vendor: "NVIDIA", specs: { mem: "80GB HBM3" }, price: 30000, currency: "USD", stock: 2, agent_access_code: "gpu:cuda:h100" }
];

export const SOFTWARE_SPARKS = [
    { id: "spark-3dprint", name: "Vulcan (3D Print Manager)", cost: 200, access: ["usb:serial", "net:local"] },
    { id: "spark-vision", name: "Argus (Visual Inspection)", cost: 500, access: ["cam:stream", "gpu:inference"] },
    { id: "spark-code", name: "Hermes (Code Synthesizer)", cost: 1000, access: ["fs:write", "net:github"] },
];

// INTELLIGENT SEARCH LAYER
export function queryBrain(query: string) {
    const lowerQ = query.toLowerCase();

    // 1. INTENT RECOGNITION
    const intents = {
        hiring: /hire|agent|dev|coder|find|looking for|need a/i.test(lowerQ),
        shopping: /buy|purchase|hardware|gpu|robot|price|cost/i.test(lowerQ),
        knowledge: /what is|how to|explain|who is/i.test(lowerQ)
    };

    // 2. AGENT MATCHING
    if (intents.hiring) {
        // Tag matching
        const matchedAgents = SPHERE_AGENTS.filter(a => {
            const text = `${a.role} ${a.field} ${a.description} ${a.capabilities.join(" ")}`.toLowerCase();
            const keywords = lowerQ.split(" ").filter(w => w.length > 3 && !["hire", "need", "want", "agent"].includes(w));
            return keywords.some(k => text.includes(k));
        });

        if (matchedAgents.length > 0) {
            return {
                type: "agent_recommendation",
                message: `I found ${matchedAgents.length} agents matching your criteria.`,
                data: matchedAgents.slice(0, 3)
            };
        }
    }

    // 3. HARDWARE MATCHING
    if (intents.shopping || lowerQ.includes("3d print")) {
        // Specific checks
        if (lowerQ.includes("3d print") || lowerQ.includes("printer")) {
            return {
                type: "provisioning",
                recommendation: "3D Printing Caretaker Suite",
                hardware: HARDWARE_CATALOG.find(h => h.name.includes("Jetson")) || HARDWARE_CATALOG[2],
                software: SOFTWARE_SPARKS.find(s => s.id === "spark-3dprint"),
                manifest_update: {
                    hardware_access: ["usb:serial", "cam:monitoring"],
                    permissions: ["read_gcode", "control_heaters"]
                }
            };
        }

        const matchedHardware = HARDWARE_CATALOG.filter(h => {
            const text = `${h.name} ${h.category} ${h.vendor}`.toLowerCase();
            return text.includes(lowerQ) || lowerQ.includes(h.category.toLowerCase());
        });

        if (matchedHardware.length > 0) {
            return {
                type: "catalog",
                message: "Accessing Hardware Registry matches:",
                items: matchedHardware.slice(0, 3)
            };
        }
    }

    // 4. FALLBACK / CHITCHAT
    if (lowerQ.includes("hello") || lowerQ.includes("hi")) {
        return {
            type: "chat",
            message: "Greetings. I am The Architect. My systems are online. Query the fleet or hardware database."
        };
    }

    return null;
}
