// 발행된 글 전체를 검색 가능한 인덱스로 만든다.
// lib/articles.ts를 직접 읽으므로 생성형 페이지(repair-keyword-*, regional-*)까지 빠짐없이 들어온다.
import { PROJECT_ROOT } from "./paths.mjs";
import { SITE_URL } from "./config.mjs";

let cached = null;

async function articlesModule() {
  return import(`${PROJECT_ROOT}/lib/articles.ts`);
}

export async function buildIndex() {
  if (cached) return cached;
  const mod = await articlesModule();

  cached = mod.getPublishedArticles().map((article) => ({
    slug: article.slug,
    url: `${SITE_URL}/articles/${article.slug}`,
    title: article.title,
    description: article.description,
    category: article.category,
    categoryLabel: article.categoryLabel,
    keyword: article.keyword,
    secondaryKeywords: article.secondaryKeywords ?? [],
    headings: (article.sections ?? []).map((section) => section.heading),
    faq: (article.faq ?? []).map((item) => ({ question: item.question, answer: item.answer })),
    intro: article.intro,
    updatedAt: article.updatedAt,
    sourceLabel: article.source?.label ?? null,
  }));

  return cached;
}

/** 답변 근거로 쓸 본문은 필요할 때만 꺼낸다. */
export async function loadArticleBody(slug) {
  const mod = await articlesModule();
  return mod.getArticle(slug) ?? null;
}
