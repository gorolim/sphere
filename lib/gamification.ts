import { db } from "@/lib/db";

// The XP thresholds required to reach each Phase (1-10)
const PHASE_XP_THRESHOLDS: Record<number, number> = {
  1: 0,      // Phase 1: Mind/Body/Spirit Check
  2: 500,    // Phase 2: Orchestrator
  3: 1500,   // Phase 3: The Merkabah
  4: 3000,   // Phase 4: Sri Yantra
  5: 5000,   // Phase 5: Oroboros Loop
  6: 8000,   // Phase 6: Omnipresence
  7: 12000,  // Phase 7: Master Narrative
  8: 18000,  // Phase 8: Gamification
  9: 25000,  // Phase 9: Nomenclature
  10: 40000, // Phase 10: AI Brain
};

// Avatar Evolution mapping
// Translates a Phase (1-10) into a visual state for the 3D Component
const AVATAR_EVOLUTION_HINTS: Record<number, string> = {
  1: "energy_orb",
  2: "wireframe",
  3: "wireframe_glowing",
  4: "solid_basic",
  5: "solid_metallic",
  6: "ethereal_ghost",
  7: "ethereal_lucid",
  8: "hologram_glitch",
  9: "hologram_stable",
  10: "manifested_being",
};

/**
 * Retrieves the AgentStat for a given user, creating it if it doesn't exist.
 */
export async function getAgentStat(userId: string) {
  let stat = await db.agentStat.findUnique({
    where: { userId },
  });

  if (!stat) {
    stat = await db.agentStat.create({
      data: {
        userId,
        totalExperience: 0,
        currentPhase: 1,
        loyaltyScore: 0,
        avatarVisualState: AVATAR_EVOLUTION_HINTS[1],
      },
    });
  }
  return stat;
}

/**
 * Adds XP to the user and checks for Phase Evolution.
 */
export async function recordAction(userId: string, xpGained: number, context?: string) {
  try {
    const stat = await getAgentStat(userId);
    const newXp = stat.totalExperience + xpGained;

    // Check if we hit a new phase threshold
    let newPhase = stat.currentPhase;
    for (let p = 10; p >= 1; p--) {
      if (newXp >= PHASE_XP_THRESHOLDS[p]) {
        if (p > stat.currentPhase) {
          newPhase = p;
        }
        break;
      }
    }

    const nextVisualState = AVATAR_EVOLUTION_HINTS[newPhase] || stat.avatarVisualState;

    const updatedStat = await db.agentStat.update({
      where: { userId },
      data: {
        totalExperience: newXp,
        currentPhase: newPhase,
        avatarVisualState: nextVisualState,
      },
    });

    return {
      stat: updatedStat,
      leveledUp: newPhase > stat.currentPhase,
      previousPhase: stat.currentPhase,
    };
  } catch (error) {
    console.error("[GAMIFICATION_RECORD_ACTION]", error);
    return null;
  }
}

/**
 * Awards a specific Badge to the User (Open Badges v3.0 simplified reference).
 */
export async function awardBadge(userId: string, badgeId: string, context?: string) {
  try {
    // Check if they already have it
    const existing = await db.userAchievement.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId,
        },
      },
    });

    if (existing) {
      return { success: false, reason: "ALREADY_AWARDED" };
    }

    const achievement = await db.userAchievement.create({
      data: {
        userId,
        badgeId,
        earnedContext: context,
      },
      include: {
        badge: true,
      },
    });

    return { success: true, achievement };
  } catch (error) {
    console.error("[GAMIFICATION_AWARD_BADGE]", error);
    return { success: false, reason: "ERROR", error };
  }
}
