export interface CreatorAgent {
    id: string;
    name: string;
    handle: string;
    niche: string;
    vibe: "Cyber-Noir" | "Organic Minimalist" | "Corporate Premium" | "Industrial Raw";
    avatar: string;
    followers: string;
    bio: string;
    price: string;
    portfolio: string[]; // URLs to thumbnails/videos
}

export const CREATOR_AGENTS: CreatorAgent[] = [
    {
        id: "CREATOR-001",
        name: "Neon-X",
        handle: "@neon_x_studio",
        niche: "Tech & Cyberpunk",
        vibe: "Cyber-Noir",
        avatar: "", // Will use a placeholder or generic URL
        followers: "1.2M",
        bio: "Specialist in high-contrast, futuristic visuals. Perfect for crypto drops and software reveals.",
        price: "0.5 ETH / clip",
        portfolio: ["/placeholders/vid1.jpg", "/placeholders/vid2.jpg"]
    },
    {
        id: "CREATOR-002",
        name: "Aura",
        handle: "@aura_lifestyle",
        niche: "Wellness & Lifestyle",
        vibe: "Organic Minimalist",
        avatar: "",
        followers: "850K",
        bio: "Soft lighting, natural tones, and serene energy. Best for health, beauty, and eco-brands.",
        price: "0.3 ETH / clip",
        portfolio: ["/placeholders/vid3.jpg", "/placeholders/vid4.jpg"]
    },
    {
        id: "CREATOR-003",
        name: "Executive Prime",
        handle: "@prime_biz",
        niche: "Finance & B2B",
        vibe: "Corporate Premium",
        avatar: "",
        followers: "2.1M",
        bio: "Sharp suits, glass offices, and trustworthy delivery. The gold standard for fintech explainer videos.",
        price: "0.8 ETH / clip",
        portfolio: ["/placeholders/vid5.jpg", "/placeholders/vid6.jpg"]
    },
    {
        id: "CREATOR-004",
        name: "Rusty Gear",
        handle: "@rusty_garage",
        niche: "Automotive & Industrial",
        vibe: "Industrial Raw",
        avatar: "",
        followers: "500K",
        bio: "Gritty textures, sparks, and high-torque visuals. For when you need to show raw power.",
        price: "0.4 ETH / clip",
        portfolio: ["/placeholders/vid7.jpg", "/placeholders/vid8.jpg"]
    }
];
