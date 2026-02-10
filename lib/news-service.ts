
export interface NewsArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines?category=technology&language=en';

// Fallback data if API fails or key is missing
const MOCK_NEWS: NewsArticle[] = [
    {
        source: { id: 'techcrunch', name: 'TechCrunch' },
        author: 'AI Reporter',
        title: 'New AI Model Surpasses Human Benchmarks in Reasoning',
        description: 'A breakthrough in neural architecture allows for more complex reasoning tasks.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        publishedAt: new Date().toISOString(),
        content: 'Full report on the new architecture...'
    },
    {
        source: { id: 'wired', name: 'Wired' },
        author: 'System',
        title: 'The Rise of Autonomous Agent Economies',
        description: 'How multi-agent systems are reshaping digital marketplaces.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1558494949-efdeb6bf80d1?w=800&q=80',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        content: 'Market analysis...'
    },
    {
        source: { id: 'the-verge', name: 'The Verge' },
        author: 'Tech Lead',
        title: 'Quantum Computing Meets Neural Networks',
        description: 'Researchers demonstrate quantum advantage in training large models.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        content: 'Quantum details...'
    }
];

export async function fetchTechNews(): Promise<NewsArticle[]> {
    if (!NEWS_API_KEY) {
        console.warn('NEWS_API_KEY is missing. Returning mock news.');
        return MOCK_NEWS;
    }

    try {
        const res = await fetch(`${BASE_URL}&apiKey=${NEWS_API_KEY}`, { next: { revalidate: 3600 } });

        if (!res.ok) {
            throw new Error(`Failed to fetch news: ${res.statusText}`);
        }

        const data = await res.json();

        // Filter out removed articles or ones without images to keep UI clean
        const articles = data.articles.filter((article: NewsArticle) =>
            article.title !== '[Removed]' && article.urlToImage
        ).slice(0, 6); // Limit to 6

        return articles.length > 0 ? articles : MOCK_NEWS;
    } catch (error) {
        console.error('NewsService Error:', error);
        return MOCK_NEWS;
    }
}
