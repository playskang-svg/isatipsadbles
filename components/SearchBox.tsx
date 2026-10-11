"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/articles";

export type SearchArticleItem = Pick<Article, "slug" | "title" | "description" | "keyword" | "categoryLabel">;

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<SearchArticleItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  // 검색 색인은 HTML에 싣지 않고 처음 입력할 때 한 번만 받는다(초기 페이로드 약 180KB 절감).
  useEffect(() => {
    if (!query || articles || failed) return;
    fetch("/api/search-index")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: SearchArticleItem[]) => setArticles(data))
      .catch(() => setFailed(true));
  }, [query, articles, failed]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized || !articles) return [];
    return articles.filter((article) =>
      `${article.title} ${article.description} ${article.keyword} ${article.categoryLabel}`.toLowerCase().includes(normalized)
    ).slice(0, 5);
  }, [query, articles]);

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
          )) : <p>{failed ? "검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." : !articles ? "검색 중…" : "일치하는 글이 없습니다. 다른 단어로 검색해 보세요."}</p>}
        </div>
      )}
    </div>
  );
}
