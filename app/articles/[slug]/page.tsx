import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { CoupangProducts } from "@/components/CoupangProducts";
import { ServiceCta } from "@/components/ServiceCta";
import { getArticle, getPublishedArticles, isArticlePublished } from "@/lib/articles";
import { getInternalLinkRecommendations } from "@/lib/internal-links";
import { getShoppingGuide } from "@/lib/shopping";
import { getMovingService } from "@/lib/services";
import { SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function renderInlineLinks(text: string) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const href = match[2];
    const sponsored = /app\.ac\//i.test(href);
    parts.push(href.startsWith("/")
      ? <Link key={`${match.index}-${href}`} href={href}>{match[1]}</Link>
      : <a key={`${match.index}-${href}`} href={href} target="_blank" rel={sponsored ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}>{match[1]}</a>);
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : text;
}

function displayDate(value: string) {
  if (!value.includes("T")) return value.replaceAll("-", ".");
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  if (!isArticlePublished(article)) return { title: "공개 예정 글", robots: { index: false, follow: false } };
  return {
    title: article.title,
    description: article.description,
    keywords: [article.keyword, ...(article.secondaryKeywords ?? []), article.categoryLabel, SITE_NAME, ...SITE_KEYWORDS],
    alternates: { canonical: `/articles/${article.slug}` },
    authors: [{ name: `${SITE_NAME} 편집팀`, url: "/about" }],
    category: article.categoryLabel,
    openGraph: { type: "article", title: article.title, description: article.description, url: `/articles/${article.slug}`, siteName: SITE_NAME, locale: "ko_KR", publishedTime: article.publishedAt, modifiedTime: article.updatedAt, authors: [SITE_NAME], section: article.categoryLabel, tags: [article.keyword, article.categoryLabel], ...(article.heroImage ? { images: [{ url: article.heroImage.src, width: 1200, height: 675, alt: article.heroImage.alt }] } : {}) },
    twitter: { card: article.heroImage ? "summary_large_image" : "summary", title: article.title, description: article.description, ...(article.heroImage ? { images: [article.heroImage.src] } : {}) },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article || !isArticlePublished(article)) notFound();
  const shoppingGuide = getShoppingGuide(article.slug);
  const movingService = getMovingService(article.slug);
  const publishedArticles = getPublishedArticles();
  const publishedArticleHrefs = new Set(publishedArticles.map((item) => `/articles/${item.slug}`));
  const isAvailableHref = (href?: string) => Boolean(href && (!href.startsWith("/articles/") || publishedArticleHrefs.has(href)));
  const recommendations = getInternalLinkRecommendations(article, publishedArticles, 6);
  const contextualLinks = recommendations.slice(0, 3);
  const related = recommendations.slice(3, 6).map((item) => item.article);
  const articleUrl = `${SITE_URL}/articles/${article.slug}`;
  const breadcrumbs = article.breadcrumbs ?? [
    { name: article.categoryLabel, href: `/category/${article.category}` },
  ];
  const wordCount = [article.intro, ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.checklist ?? [])]), ...article.faq.flatMap((item) => [item.question, item.answer])].join(" ").split(/\s+/).length;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}/#article`,
    headline: article.title,
    description: article.description,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "ko-KR",
    articleSection: article.categoryLabel,
    keywords: [article.keyword, ...(article.secondaryKeywords ?? []), article.categoryLabel, SITE_NAME, ...SITE_KEYWORDS],
    wordCount,
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: `${SITE_URL}/about` },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    ...(article.heroImage ? { image: `${SITE_URL}${article.heroImage.src}` } : {}),
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      ...breadcrumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 2, name: crumb.name, item: `${SITE_URL}${crumb.href}` })),
      { "@type": "ListItem", position: breadcrumbs.length + 2, name: article.title, item: articleUrl },
    ],
  };
  const regionTreeSchema = article.regionTree ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: article.regionTree.title,
    numberOfItems: article.regionTree.districts.flatMap((district) => district.dongs).filter((dong) => isAvailableHref(dong.href)).length,
    itemListElement: article.regionTree.districts.flatMap((district) => district.dongs).filter((dong) => isAvailableHref(dong.href)).map((dong, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: dong.name,
      url: `${SITE_URL}${dong.href}`,
    })),
  } : null;

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {regionTreeSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(regionTreeSchema) }} />}
      <header className={`article-hero article-${article.accent}`}>
        <div className="narrow-container">
          <nav className="breadcrumb" aria-label="현재 위치">
            <Link href="/">홈</Link>
            {breadcrumbs.map((crumb) => <Fragment key={crumb.href}><span>›</span><Link href={crumb.href}>{crumb.name}</Link></Fragment>)}
          </nav>
          <p className="eyebrow">{article.categoryLabel} · {article.keyword}</p>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.description}</p>
          <div className="article-meta"><span>업데이트 {displayDate(article.updatedAt)}</span><span>{article.readingTime}분 읽기</span><span>편집팀</span></div>
        </div>
      </header>
      <div className="article-layout container">
        <aside className="article-aside">
          <strong>이 글의 핵심</strong><p>{article.intro}</p><span className="aside-line" />
          <nav className="article-toc" aria-label="글 목차"><strong>목차</strong><ol>{article.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol></nav>
        </aside>
        <div className="article-content">
          <details className="mobile-toc"><summary>이 글의 목차</summary><ol>{article.sections.map((section, index) => <li key={section.heading}><span className="mobile-toc-index" aria-hidden="true">{index + 1}</span><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol></details>
          {article.affiliateNotice && <p className="affiliate-notice">이 글에는 제휴 링크가 포함되어 있으며, 상담이나 계약이 이루어지면 운영자에게 수수료가 지급될 수 있습니다. 이용자에게 별도 비용이 추가되는 것은 아닙니다.</p>}
          {article.heroImage && (
            <figure className="article-visual article-visual-hero">
              <img src={article.heroImage.src} alt={article.heroImage.alt} width="1200" height="675" fetchPriority="high" />
              <strong className="article-visual-title">{article.heroImage.title}</strong>
              {article.heroImage.caption && <figcaption>{article.heroImage.caption}</figcaption>}
            </figure>
          )}
          <p className="lead">{article.intro}</p>
          {article.regionTree && (
            <section className="region-keyword-tree" aria-labelledby="region-tree-title">
              <p className="eyebrow dark">지역별 연결 정보</p>
              <h2 id="region-tree-title">{article.regionTree.title}</h2>
              <p>{article.regionTree.description}</p>
              <div className="region-tree-grid">
                {article.regionTree.districts.map((district) => (
                  <div className="region-tree-district" key={district.name}>
                    {isAvailableHref(district.href)
                      ? <Link className="region-district-link" href={district.href}>{district.name} 전체 보기 <span aria-hidden="true">→</span></Link>
                      : <span className="region-district-link region-district-pending">{district.name} <small>공개 예정</small></span>}
                    <div className="region-dong-links">
                      {district.dongs.map((dong) => (
                        <span className="region-dong-item" key={`${district.name}-${dong.name}`}>
                          {isAvailableHref(dong.href) ? <Link href={dong.href!}>{dong.name}</Link> : <span className="region-dong-pending" title={dong.status ?? "콘텐츠 공개 예정"}>{dong.name}</span>}
                          {dong.apartments && <span className="region-apartment-links">{dong.apartments.map((apartment) => isAvailableHref(apartment.href)
                            ? <Link key={apartment.href} href={apartment.href}>{apartment.name}</Link>
                            : <span className="region-dong-pending" key={apartment.href} title="콘텐츠 공개 예정">{apartment.name}</span>)}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {article.sections.map((section, index) => (
            <Fragment key={section.heading}>
              <section id={`section-${index + 1}`}>
                <h2>{section.heading}</h2>
                {section.image && (
                  <figure className="article-visual article-visual-section">
                    <img src={section.image.src} alt={section.image.alt} width="1200" height="675" loading="lazy" />
                    <strong className="article-visual-title">{section.image.title}</strong>
                    {section.image.caption && <figcaption>{section.image.caption}</figcaption>}
                  </figure>
                )}
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{renderInlineLinks(paragraph)}</p>)}
                {section.checklist && <div className="checklist"><strong>바로 확인하기</strong><ul>{section.checklist.map((item) => <li key={item}>{item}</li>)}</ul></div>}
              </section>
              {index % 2 === 0 && index <= 4 && contextualLinks[Math.floor(index / 2)] && (() => {
                const recommendation = contextualLinks[Math.floor(index / 2)];
                return (
                  <aside className="contextual-link" aria-label="연관 글 안내">
                    <span>함께 확인하면 좋은 글</span>
                    <p>{recommendation.reason}</p>
                    <Link href={`/articles/${recommendation.article.slug}`}>{recommendation.anchor} <b aria-hidden="true">→</b></Link>
                    <small>{recommendation.article.description}</small>
                  </aside>
                );
              })()}
              {index === 1 && movingService && <ServiceCta service={movingService} />}
            </Fragment>
          ))}
          {shoppingGuide && <CoupangProducts articleSlug={article.slug} guide={shoppingGuide} />}
          {article.source && <div className="source-box"><strong>공식 자료 확인</strong><p>제도와 조건은 바뀔 수 있습니다. 신청하거나 결정하기 전에 최신 내용을 확인하세요.</p><a href={article.source.url} target="_blank" rel="noopener noreferrer">{article.source.label} ↗</a></div>}
          <section className="faq-section"><p className="eyebrow dark">FAQ</p><h2>자주 묻는 질문</h2>{article.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
          <div className="editor-note"><strong>편집 원칙</strong><p>이 글은 일반적인 정보 제공을 목적으로 합니다. 계약·보증금·행정 절차는 개인 상황에 따라 달라질 수 있으므로 최신 공식 정보와 전문가 상담을 함께 확인하세요.</p></div>
        </div>
      </div>
      {related.length > 0 && <section className="section related-section"><div className="container"><div className="section-heading"><div><p className="eyebrow dark">RELATED GUIDE</p><h2>이 글과 연결되는 다음 단계</h2></div><p>현재 글과 주제·준비 순서가 가까운 글만 골랐습니다.</p></div><div className="article-grid">{related.map((item) => <ArticleCard key={item.slug} article={item} />)}</div></div></section>}
    </article>
  );
}
