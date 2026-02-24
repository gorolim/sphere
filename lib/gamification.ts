import { prisma } from "@/lib/prisma";

// The XP curve requirements for each of the 10 Tarot phases
const PHASE_XP_REQUIREMENTS: Record<number, number> = {
    1: 0,       // The Spark (Arcanum 0)
    2: 100,     // The Alignment (Arcanum 1: The Magician)
    3: 300,     // The Simulation (Arcanum 2: The High Priestess)
    4: 600,     // The Value Exchange (Arcanum 3: The Empress)
    5: 1000,    // The Awakening (Arcanum 4: The Emperor)
    6: 1500,    // The Omnipresence Engine (Arcanum 5: The Hierophant)
    7: 2100,    // The Broadcast (Arcanum 6: The Lovers)
    8: 2800,    // The Creator (Arcanum 7: The Chariot)
    9: 3600,    // The Synchronization (Arcanum 8: Strength)
    10: 5000,   // The Automator (Arcanum 21: The World)
};

// Map of phases to their corresponding Avatar visual states
const AVATAR_VISUAL_STATES: Record<number, string> = {
    1: "energy_orb",
    2: "glowing_core",
    3: "wireframe",
    4: "solid_material",
    5: "awakened_eyes",
    6: "energy_tendrils",
    7: "armor_plating",
    8: "power_aura",
    9: "biomechanical_lexicon",
    10: "enlightened_world",
};

/**
 * Ensures a user has an AgentStat record, creating one if it doesn't exist.
 */
export async function getAgentStat(userId: string) {
    let stat = await prisma.agentStat.findUnique({ where: { userId } });
    
    if (!stat) {
        stat = await prisma.agentStat.create({
            data: {
                userId,
                totalExperience: 0,
                currentPhase: 1,
                loyaltyScore: 0,
                avatarVisualState: "energy_orb",
            },
        });
    }
    return stat;
}

/**
 * Awards experience points to a user and triggers a phase check.
 * Used passively when backend milestones are hit (e.g., publishing a gig).
 */
export async function awardExperience(userId: string, amount: number) {
    const stat = await getAgentStat(userId);
    
    const newTotal = stat.totalExperience + amount;
    
    await prisma.agentStat.update({
        where: { userId },
        data: { totalExperience: newTotal }
    });
    
    // Evaluate if this new XP total triggers a Tarot Evolution
    await checkPhaseUpgrade(userId);
}

/**
 * Checks if the user's current XP meets the threshold for the next Tarot Phase.
 * If so, upgrades their DB record, updating the 3D Avatar's visual state.
 */
export async function checkPhaseUpgrade(userId: string) {
    const stat = await getAgentStat(userId);
    const currentXP = stat.totalExperience;
    let newPhase = stat.currentPhase;

    // Loop through the phases to find the highest phase earned by XP
    for (let phase = 10; phase >= 1; phase--) {
        if (currentXP >= PHASE_XP_REQUIREMENTS[phase]) {
            newPhase = Math.max(newPhase, phase);
            break;
        }
    }

    if (newPhase > stat.currentPhase) {
        const visualState = AVATAR_VISUAL_STATES[newPhase] || "energy_orb";
        
        await prisma.agentStat.update({
            where: { userId },
            data: { 
                currentPhase: newPhase,
                avatarVisualState: visualState
            }
        });
        
        console.log(`[ALCHEMICAL ENGINE] User ${userId} evolved to Phase ${newPhase}. Avatar mutating to ${visualState}.`);
    }
}
