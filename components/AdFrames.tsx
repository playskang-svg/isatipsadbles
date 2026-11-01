import { COUPANG_TRACKING_CODE, coupangBannerId } from "@/lib/coupang-links";

/** 숨고 견적 배너. 사이트 색에 맞춘 정적 페이지를 iframe으로 띄우고, 누를 때만 딥링크로 이동한다. */
export function QuoteBanner({ headline, sub, url }: { headline: string; sub: string; url: string }) {
  const src = `/banners/soomgo?h=${encodeURIComponent(headline)}&s=${encodeURIComponent(sub)}&u=${encodeURIComponent(url)}`;
  return <iframe className="quote-banner" src={src} title={`${headline} 광고`} loading="lazy" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" />;
}

/** 쿠팡 다이나믹 배너. 화면 폭에 맞는 크기만 CSS로 보이게 한다. */
export function CoupangBanner({ bannerKey }: { bannerKey: string }) {
  const id = coupangBannerId(bannerKey) ?? coupangBannerId("default");
  if (!id) return null;
  const src = (width: number, height: number) => `https://ads-partners.coupang.com/widgets.html?id=${id}&template=carousel&trackingCode=${COUPANG_TRACKING_CODE}&subId=isatips&width=${width}&height=${height}&tsource=`;
  return (
    <div className="coupang-banner">
      <iframe className="coupang-banner-wide" src={src(680, 140)} width={680} height={140} title="쿠팡 관련 상품 광고" loading="lazy" referrerPolicy="unsafe-url" />
      <iframe className="coupang-banner-narrow" src={src(320, 250)} width={320} height={250} title="쿠팡 관련 상품 광고" loading="lazy" referrerPolicy="unsafe-url" />
    </div>
  );
}
