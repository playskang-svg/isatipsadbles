"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/articles";

export function SearchBox({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return articles.filter((article) =>
      `${article.title} ${article.description} ${article.keyword} ${article.categoryLabel}`.toLowerCase().includes(normalized)
    ).slice(0, 5);
  }, [query]);

  return (
    <div className="search-wrap">
      <label htmlFor="site-search">무엇을 준비하고 계신가요?</label>
      <div className="search-control">
        <span aria-hidden="true">⌕</span>
        <input id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 포장이사 비용, 전입신고, 이사 청소" autoComplete="off" />
      </div>
      {query && (
        <div className="search-results" role="status">
          {results.length ? results.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`}>
              <span>{article.categoryLabel}</span>{article.title}
            </Link>
          )) : <p>일치하는 글이 없습니다. 다른 단어로 검색해 보세요.</p>}
        </div>
      )}
    </div>
  );
}
