
import { fetchTechNews } from "@/lib/news-service";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const news = await fetchTechNews();
    return NextResponse.json(news);
}
