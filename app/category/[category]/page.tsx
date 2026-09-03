import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { categoryMeta, getPublishedArticles } from "@/lib/articles";
import { repairRegionalIndex } from "@/lib/repair-regional-pages";
import { SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

type CategoryKey = keyof typeof categoryMeta;

export function generateStaticParams() { return Object.keys(categoryMeta).map((category) => ({ category })); }
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category as CategoryKey];
  if (!meta) return {};
  return {
    title: `${meta.label} 정보`,
    description: meta.description,
    keywords: [meta.label, "이사 정보", SITE_NAME, ...SITE_KEYWORDS],
    alternates: { canonical: `/category/${category}` },
    openGraph: { type: "website", title: `${meta.label} 정보`, description: meta.description, url: `/category/${category}`, siteName: SITE_NAME },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const meta = categoryMeta[category as CategoryKey];
  if (!meta) notFound();
  const items = getPublishedArticles().filter((article) => article.category === category);
  const keywordItems = category === "repair-install" ? items.filter((article) => article.slug.startsWith("repair-keyword-")) : [];
  const regionalRepairItems = category === "regional" ? repairRegionalIndex : [];
  const featuredItems = category === "repair-install"
    ? items.filter((article) => !article.slug.startsWith("repair-keyword-"))
    : category === "regional"
      ? items.filter((article) => !article.slug.startsWith("regional-repair-"))
      : items;
  const regionalRepairGroups = regionalRepairItems.map((item) => item.region).filter((region, index, regions) => regions.indexOf(region) === index).map((region) => ({
    region,
    items: regionalRepairItems.filter((item) => item.region === region),
  }));
  const schemaItems = category === "regional"
    ? [
        ...featuredItems.map((article) => ({ name: article.title, href: `/articles/${article.slug}` })),
        ...regionalRepairItems.map((item) => ({ name: item.title, href: item.href })),
      ]
    : items.map((article) => ({ name: article.title, href: `/articles/${article.slug}` }));
  const categoryUrl = `${SITE_URL}/category/${category}`;
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}/#collection`,
    name: `${meta.label} 정보`,
    description: meta.description,
    url: categoryUrl,
    inLanguage: "ko-KR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: schemaItems.length,
      itemListElement: schemaItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${SITE_URL}${item.href}`,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: meta.label, item: categoryUrl },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="listing-hero"><div className="container"><nav className="breadcrumb"><Link href="/">홈</Link><span>›</span><span>{meta.label}</span></nav><p className="eyebrow">CATEGORY</p><h1>{meta.label}</h1><p>{meta.description}</p></div></header>
      <section className="section"><div className="container"><div className="listing-bar"><strong>{schemaItems.length}개의 글</strong><span>최근 업데이트 순</span></div><div className="article-grid">{featuredItems.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></div></section>
      {keywordItems.length > 0 && (
        <section className="section keyword-index-section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow dark">REPAIR KEYWORD GUIDE</p><h2>증상·공사·지역별 상세 가이드</h2></div><p>찾는 표현을 선택하면 해당 키워드 전용 점검·견적 페이지로 이동합니다.</p></div>
            <ul className="keyword-index-list">
              {keywordItems.map((article) => <li key={article.slug}><Link href={`/articles/${article.slug}`}>{article.keyword}<span aria-hidden="true">→</span></Link></li>)}
            </ul>
          </div>
        </section>
      )}
      {regionalRepairGroups.length > 0 && (
        <section className="section regional-service-index-section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow dark">LOCAL REPAIR GUIDE</p><h2>지역별 문·집수리 상세 가이드</h2></div><p>경기도 생활권별 수리·설치 글과 기존 지역 전용 페이지를 한곳에 연결했습니다.</p></div>
            <div className="regional-service-groups">
              {regionalRepairGroups.map((group) => (
                <section className="regional-service-group" key={group.region}>
                  <div className="regional-service-group-title"><h3>{group.region}</h3><span>{group.items.length}개</span></div>
                  <ul className="regional-service-link-list">
                    {group.items.map((item) => <li key={item.href}><Link href={item.href}><span>{item.keyword}</span>{item.locality && <small>{item.locality}</small>}<b aria-hidden="true">→</b></Link></li>)}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
