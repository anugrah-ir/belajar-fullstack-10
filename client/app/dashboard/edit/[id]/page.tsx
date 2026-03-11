"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPost() {
    const router = useRouter();
    const params = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchPost = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
                const res = await fetch(`${apiUrl}/posts/${params.id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch post");
                }

                const data = await res.json();
                setTitle(data.title);
                setContent(data.content);
            } catch (err: any) {
                setError(err.message || "Failed to load post");
            } finally {
                setIsFetching(false);
            }
        };

        if (params.id) {
            fetchPost();
        }
    }, [params.id, router]);

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

            const res = await fetch(`${apiUrl}/posts/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update post");
            }

            setSuccess(true);

            // Redirect back to dashboard after a short delay
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-6">
                <p className="text-gray-500">Loading post data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Post</h1>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-4 rounded transition"
                >
                    Back to Dashboard
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm border border-green-200">
                    Post updated successfully! Redirecting...
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
                        className="border p-2 rounded h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        placeholder="Write your post content here..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 mt-2"
                >
                    {isLoading ? "Saving Changes..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
