import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | 이사 준비와 포장이사 정보`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ko_KR", siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION, url: "/", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION, images: [DEFAULT_OG_IMAGE_URL] },
  other: { "og:image:secure_url": DEFAULT_OG_IMAGE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="3282d2db9375a4851fb63d9c035dd838b949ad12" />
        <meta name="google-site-verification" content="LWdL0F6ApPkB6JBk2OCFG61dmbCZ0c83kTK5J-P6Z2Q" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DE5FM2FHN7');
// 초기 렌더링을 막지 않도록 로드 후 유휴 시간에 gtag.js를 불러온다.
window.addEventListener('load', function () {
  var load = function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-DE5FM2FHN7';
    document.head.appendChild(s);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 3000 });
  else setTimeout(load, 1500);
});`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">본문 바로가기</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
