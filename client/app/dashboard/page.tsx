"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [isFetchingPosts, setIsFetchingPosts] = useState(true);

    const fetchPosts = async () => {
        setIsFetchingPosts(true);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

            const res = await fetch(`${apiUrl}/posts/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        } finally {
            setIsFetchingPosts(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // Redirect to login if not authenticated
        }
        else {
            fetchPosts()
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

            const res = await fetch(`${apiUrl}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create post");
            }

            setSuccess(true);
            setTitle("");
            setContent("");
            fetchPosts() // Redirect to homepage or clear form it's up to you
            router.refresh(); // Refresh the data on the homepage
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a New Post</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm border border-green-200">
                        Post created successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="font-medium text-sm text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your post title"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="content" className="font-medium text-sm text-gray-700">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border p-2 rounded h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            placeholder="Write your post content here..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 mt-2"
                    >
                        {isLoading ? "Publishing..." : "Publish Post"}
                    </button>
                </form>
            </div>

            <div className="mt-12 pt-8 border-t">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Posts</h2>

                {isFetchingPosts ? (
                    <div className="text-gray-500 text-sm">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded text-center border border-dashed">
                        You haven't written any posts yet.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {posts.map((post) => (
                            <div key={post.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 hover:bg-gray-100 transition">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{post.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Published on {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    <button
                                        onClick={() => router.push(`/dashboard/edit/${post.id}`)}
                                        className="flex-1 sm:flex-none text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-1.5 px-4 rounded transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
                                                try {
                                                    const token = localStorage.getItem("token");
                                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

                                                    const res = await fetch(`${apiUrl}/posts/${post.id}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            Authorization: `Bearer ${token}`
                                                        }
                                                    });

                                                    if (!res.ok) throw new Error("Failed to delete post");

                                                    // Remove from state or refetch
                                                    setPosts(posts.filter(p => p.id !== post.id));
                                                    alert("Post deleted successfully");
                                                    router.refresh();
                                                } catch (err: any) {
                                                    alert(err.message || "Failed to delete post");
                                                }
                                            }
                                        }}
                                        className="flex-1 sm:flex-none text-sm bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium py-1.5 px-4 rounded transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
