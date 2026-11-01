import { affiliateRel, affiliateTarget } from "@/lib/affiliate";
import { coupangUrl } from "@/lib/coupang-links";
import type { ShoppingGuide } from "@/lib/shopping";

export function ShoppingPicks({ guide }: { guide: ShoppingGuide }) {
  return (
    <section className="shopping-section" aria-labelledby="shopping-heading">
      <p className="eyebrow dark">MOVING PICKS</p>
      <h2 id="shopping-heading">{guide.title}</h2>
      <p>{guide.description}</p>
      <div className="shopping-grid">
        {guide.suggestions.map((item) => {
          const url = coupangUrl(item.keyword);
          return (
            <article className="product-card" key={item.label}>
              <div className="product-copy">
                <span className="product-label">{item.label}</span>
                <h3>{item.keyword}</h3>
                <p>{item.note}</p>
                {url && <a className="product-button" href={url} target={affiliateTarget} rel={affiliateRel} aria-label={`${item.label} 쿠팡 검색 결과 새 창으로 열기`}>쿠팡에서 가격 보기 <span aria-hidden="true">↗</span></a>}
              </div>
            </article>
          );
        })}
      </div>
      <p className="shopping-footnote">상품 가격과 재고는 쿠팡 판매 페이지에서 최종 확인하세요.</p>
    </section>
  );
}
