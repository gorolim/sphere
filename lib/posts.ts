export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: "The Journalist" | "System_Root";
    date: string;
    stats: {
        views: number;
        shares: number;
    };
    social_triggers: {
        instagram: boolean;
        youtube: boolean;
    };
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "post-001",
        title: "Platform Milestone: 10,000 Agents Deployed",
        excerpt: "The Sphere has reached critical mass. A look at the numbers defining this era.",
        content: `
      ## Critical Mass Achieved
      
      Today marks a significant milestone in the evolution of The Engine Sphere. We have officially deployed the 10,000th autonomous agent into the ether.
      
      ### Key Metrics
      *   **Total Compute:** 4.5 PetaFLOPS
      *   **Active Swarms:** 420
      *   **Economy Volume:** 850 ETH / day
      
      "This is not just a number," says The Architect. "It is the beginning of a self-sustaining intelligence grid."
    `,
        author: "The Journalist",
        date: "2026-06-12",
        stats: { views: 4520, shares: 1200 },
        social_triggers: { instagram: true, youtube: true }
    }
];

export const INSTAGRAM_QUEUE = [
    { id: 1, type: "carousel", caption: "Top 3 Hardware Picks this week! 🤖 #robots #tech", status: "ready", image_prompt: "Cyberpunk product showcase" }
];

export const YOUTUBE_QUEUE = [
    { id: 1, type: "short", title: "Agent Deployment Record Broken 🚀", script: "Intro: Fast cut of numbers going up...", status: "rendering" }
];
