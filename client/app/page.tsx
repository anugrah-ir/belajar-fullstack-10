import ArticleCard from "./components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let articles = [];

  try {
    const res = await fetch(`${process.env.API_URL}/posts`, { cache: "no-store" });
    if (res.ok) {
      articles = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article: any) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
