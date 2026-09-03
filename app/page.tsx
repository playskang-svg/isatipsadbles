import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchBox } from "@/components/SearchBox";
import { categoryMeta, getPublishedArticles } from "@/lib/articles";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function Home() {
  const articles = getPublishedArticles();
  const searchArticles = articles.map(({ slug, title, description, keyword, categoryLabel }) => ({
    slug,
    title,
    description,
    keyword,
    categoryLabel,
  }));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "ko-KR",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: "이사 준비부터 입주 후 정리까지 실용적인 생활 정보를 제공하는 편집형 정보 사이트",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">MOVE SMART, LIVE EASY</p>
            <h1>복잡한 이사도<br/><em>순서대로 하면</em> 쉽습니다.</h1>
            <p className="hero-description">견적부터 포장, 청소, 전입신고와 보증금까지. 이사 전후에 필요한 모든 정보를 한곳에서 확인하세요.</p>
            <div className="hero-actions"><Link className="primary-button" href="/articles/moving-preparation-checklist">이사 준비 시작하기</Link><Link className="secondary-button" href="#latest">핵심 정보 보기</Link></div>
            <div className="trust-row"><span>✓ 날짜별 준비</span><span>✓ 공식 출처 확인</span><span>✓ 실전 체크리스트</span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun-orbit"><span /></div>
            <div className="step step-one">견적</div><div className="step step-two">포장</div><div className="step step-three">입주</div>
            <div className="hero-quote">“한 달 전부터<br/>한 칸씩 준비하세요.”</div>
          </div>
        </div>
      </section>

      <section className="search-section"><div className="container"><SearchBox articles={searchArticles} /></div></section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow dark">MOVING GUIDE</p><h2>이사 단계별로 찾아보세요</h2></div><p>지금 필요한 단계부터 읽고,<br/>바로 확인할 목록을 챙겨가세요.</p></div>
          <div className="category-grid">
            {Object.entries(categoryMeta).map(([key, item], index) => (
              <Link href={`/category/${key}`} className="category-card" key={key}>
                <span className="category-index">0{index + 1}</span><h3>{item.label}</h3><p>{item.description}</p><span className="round-arrow">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section latest-section" id="latest">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow dark">FIRST CHECK</p><h2>가장 먼저 읽을 글</h2></div><Link href="/category/planning" className="text-link">이사 준비 전체 보기 →</Link></div>
          {articles[0] && <ArticleCard article={articles[0]} featured />}
          <div className="article-grid">{articles.slice(1, 4).map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </div>
      </section>

      <section className="principle-section">
        <div className="container principle-grid">
          <div><p className="eyebrow">OUR PRINCIPLE</p><h2>좋은 이사는<br/>좋은 기록에서 시작됩니다.</h2></div>
          <div className="principle-list">
            <div><strong>01</strong><span><b>조건을 같은 표에</b>최저가보다 포함 범위와 추가 비용을 함께 봅니다.</span></div>
            <div><strong>02</strong><span><b>약속은 문서로</b>견적·계약·하자와 계량기 상태를 기록합니다.</span></div>
            <div><strong>03</strong><span><b>공식 정보 확인</b>전입신고와 보증금은 공식 기관으로 연결합니다.</span></div>
          </div>
        </div>
      </section>

      <section className="section more-section">
        <div className="container"><div className="section-heading"><div><p className="eyebrow dark">MORE TO READ</p><h2>이어서 읽기</h2></div></div><div className="article-grid">{articles.slice(4, 16).map((article) => <ArticleCard key={article.slug} article={article} />)}</div></div>
      </section>
    </>
  );
}
