import Link from "next/link";

type ArticleCardProps = {
    article: {
        id: string;
        title: string;
        content?: string;
        authorId?: string;
        createdAt?: string;
        updatedAt?: string;
    };
};

export default function ArticleCard({ article }: ArticleCardProps) {
    const authorName = "Author";

    return (
        <article className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                    {authorName[0]}
                </div>
                <span className="text-sm font-medium">{authorName}</span>
            </div>
            <Link href={`/posts/${article.id}`}>
                <h2 className="text-xl font-bold mb-3 hover:text-blue-600 cursor-pointer">
                    {article.title}
                </h2>
            </Link>
            <p className="text-gray-600 text-sm line-clamp-3">
                {article.content}
            </p>
        </article>
    );
}
