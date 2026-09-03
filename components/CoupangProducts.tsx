"use client";

import { useEffect, useState } from "react";
import type { ShoppingGuide } from "@/lib/shopping";

type Product = {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string | null;
  productUrl: string;
  isRocket: boolean;
  isFreeShipping: boolean;
};

type ProductItem = ShoppingGuide["suggestions"][number] & { product: Product | null };
type ProductResponse = Pick<ShoppingGuide, "title" | "description"> & { items: ProductItem[] };

export function CoupangProducts({ articleSlug, guide }: { articleSlug: string; guide: ShoppingGuide }) {
  const [data, setData] = useState<ProductResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setFailed(false);
    fetch(`/api/coupang-products?article=${encodeURIComponent(articleSlug)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("product request failed");
        return response.json() as Promise<ProductResponse>;
      })
      .then(setData)
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, [articleSlug]);

  return (
    <section className="shopping-section" aria-labelledby="shopping-heading">
      <p className="eyebrow dark">MOVING PICKS</p>
      <h2 id="shopping-heading">{guide.title}</h2>
      <p>{guide.description}</p>
      <p className="affiliate-notice">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>

      {failed ? (
        <div className="shopping-message" role="status">현재 상품 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</div>
      ) : (
        <div className="shopping-grid" aria-busy={!data}>
          {(data?.items ?? guide.suggestions.map((suggestion) => ({ ...suggestion, product: null }))).map((item) => (
            <article className={`product-card${data ? "" : " product-loading"}`} key={item.label}>
              {item.product?.imageUrl ? <img src={item.product.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <div className="product-placeholder" aria-hidden="true">BOX</div>}
              <div className="product-copy">
                <span className="product-label">{item.label}</span>
                <h3>{item.product?.name ?? item.note}</h3>
                <p>{item.note}</p>
                {item.product?.price !== null && item.product?.price !== undefined && <strong className="product-price">{item.product.price.toLocaleString("ko-KR")}원</strong>}
                {item.product ? (
                  <a className="product-button" href={item.product.productUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label={`${item.label} 구매 페이지 새 창으로 열기`}>
                    구매 바로가기 <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="product-button disabled" aria-hidden="true">상품 확인 중</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="shopping-footnote">상품 가격과 재고는 쿠팡 판매 페이지에서 최종 확인하세요.</p>
    </section>
  );
}
