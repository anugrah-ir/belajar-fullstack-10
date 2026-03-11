import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let post = null;

    try {
        const res = await fetch(`${process.env.API_URL}/posts/${id}`, { cache: "no-store" });
        if (res.ok) {
            post = await res.json();
        } else if (res.status === 404) {
            return notFound();
        }
    } catch (error) {
        console.error("Failed to fetch post:", error);
    }

    if (!post) {
        return (
            <div className="max-w-3xl mx-auto py-10">
                <h1 className="text-2xl font-bold">Failed to load article.</h1>
            </div>
        );
    }

    return (
        <article className="max-w-3xl mx-auto py-10">
            <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
                &larr; Back to Home
            </Link>
            <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 mb-8 text-gray-500">
                <span>By Author</span>
                <span>•</span>
                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
            <div className="prose prose-lg">
                {post.content.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                ))}
            </div>
        </article>
    );
}
