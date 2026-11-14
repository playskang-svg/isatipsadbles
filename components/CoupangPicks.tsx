import { affiliateTarget } from "@/lib/affiliate";
import type { CoupangPick, CoupangProduct } from "@/lib/coupang-picks";

/** 글 중간 쿠팡 상품 카드. 가운데 정렬, 버튼 바로 앞 한 줄에 고르는 이유. 링크는 AF8819972 단축링크. */
export function CoupangPicks({ items }: { items: (CoupangPick & CoupangProduct)[] }) {
  return (
    <div className="coupang-picks">
      {items.map((item) => (
        <div className="coupang-pick" key={item.id}>
          <img src={item.img} alt={item.title} width={212} height={212} loading="lazy" referrerPolicy="no-referrer" />
          <strong>{item.title}</strong>
          <p>{item.reason}</p>
          <a className="coupang-pick-button" href={item.url} target={affiliateTarget} rel="sponsored nofollow noopener">쿠팡에서 가격 보기 <span aria-hidden="true">↗</span></a>
        </div>
      ))}
      <small>상품 가격과 재고는 쿠팡 판매 페이지에서 최종 확인하세요.</small>
    </div>
  );
}
