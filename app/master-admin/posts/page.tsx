
import { prisma } from "@/lib/db";
import PostsTable from "@/components/admin/PostsTable";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" }
    });

    return <PostsTable initialPosts={posts} />;
}
