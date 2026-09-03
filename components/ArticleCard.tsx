import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`article-card ${featured ? "featured-card" : ""}`}>
      <Link href={`/articles/${article.slug}`} className={`card-visual ${article.accent}`} aria-label={article.title}>
        {article.heroImage && <img src={article.heroImage.src} alt={article.heroImage.alt} width="1200" height="675" loading="lazy" />}
        <span className="visual-kicker">{article.categoryLabel}</span>
        <span className="visual-number">{featured ? "01" : article.readingTime.toString().padStart(2, "0")}</span>
        <span className="visual-line" />
        {article.heroImage && <strong className="card-image-title">{article.heroImage.title}</strong>}
      </Link>
      <div className="card-body">
        <div className="card-meta"><span>{article.categoryLabel}</span><span>{article.readingTime}분</span></div>
        <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.description}</p>
        <Link href={`/articles/${article.slug}`} className="text-link">글 읽기 <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
