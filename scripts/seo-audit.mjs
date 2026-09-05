const baseUrl = (process.env.SITE_AUDIT_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalBase = (process.env.CANONICAL_URL || "https://isatips.adbles.com").replace(/\/$/, "");
const categories = ["planning", "quotes", "admin", "home-care", "regional", "repair-install"];
const articles = [
  "moving-preparation-checklist",
  "moving-company-quote-comparison",
  "packing-moving-cost-factors",
  "moving-day-checklist",
  "move-in-report-address-change",
  "moving-cleaning-guide",
  "rental-deposit-moving-out-checklist",
  "moving-with-pets",
  "easy-interior-ideas-for-beginners",
  "son-eomneun-nal-moving-guide",
  "air-conditioner-moving-installation-cost",
  "wall-mounted-tv-moving-installation-cost",
  "washer-dryer-moving-installation-cost",
];
const pages = ["/", "/about", "/editorial-policy", ...categories.map((value) => `/category/${value}`), ...articles.map((value) => `/articles/${value}`)];
const failures = [];
const titles = new Map();
const descriptions = new Map();

function matchContent(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function addUnique(map, value, path, label) {
  if (!value) return;
  if (map.has(value)) failures.push(`${path}: ${label}가 ${map.get(value)}와 중복됩니다.`);
  else map.set(value, path);
}

for (const path of pages) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    failures.push(`${path}: HTTP ${response.status}`);
    continue;
  }
  const html = await response.text();
  const title = matchContent(html, /<title[^>]*>([^<]+)<\/title>/i);
  const description = matchContent(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  const canonical = matchContent(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  const viewport = matchContent(html, /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  const expectedCanonical = path === "/" ? canonicalBase : `${canonicalBase}${path}`;

  if (!title) failures.push(`${path}: title이 없습니다.`);
  if (!description) failures.push(`${path}: meta description이 없습니다.`);
  if (canonical !== expectedCanonical) failures.push(`${path}: canonical이 예상값과 다릅니다 (${canonical || "없음"}).`);
  if (!viewport.includes("device-width")) failures.push(`${path}: 모바일 viewport가 없습니다.`);
  if (h1Count !== 1) failures.push(`${path}: H1이 ${h1Count}개입니다.`);
  addUnique(titles, title, path, "title");
  addUnique(descriptions, description, path, "description");

  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => {
    try { return JSON.parse(match[1]); }
    catch { failures.push(`${path}: 파싱할 수 없는 JSON-LD가 있습니다.`); return null; }
  }).filter(Boolean);
  const serialized = JSON.stringify(jsonLd);
  if (path === "/" && (!serialized.includes('"WebSite"') || !serialized.includes('"Organization"'))) failures.push(`${path}: WebSite/Organization 구조화 데이터가 없습니다.`);
  if (path.startsWith("/category/") && (!serialized.includes('"CollectionPage"') || !serialized.includes('"BreadcrumbList"'))) failures.push(`${path}: 카테고리 구조화 데이터가 부족합니다.`);
  if (path.startsWith("/articles/") && (!serialized.includes('"BlogPosting"') || !serialized.includes('"FAQPage"') || !serialized.includes('"BreadcrumbList"'))) failures.push(`${path}: 글 구조화 데이터가 부족합니다.`);
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
for (const path of pages) {
  const expected = path === "/" ? canonicalBase : `${canonicalBase}${path}`;
  if (!sitemap.includes(`<loc>${expected}</loc>`)) failures.push(`sitemap.xml: ${path}가 없습니다.`);
}

const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
const robots = await robotsResponse.text();
if (!robots.includes("Allow: /")) failures.push("robots.txt: 전체 페이지 허용 규칙이 없습니다.");
if (!robots.includes("Disallow: /api/")) failures.push("robots.txt: API 색인 차단 규칙이 없습니다.");
if (!robots.includes(`Sitemap: ${canonicalBase}/sitemap.xml`)) failures.push("robots.txt: 사이트맵 주소가 올바르지 않습니다.");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`SEO audit passed: ${pages.length} pages, ${articles.length} articles, ${categories.length} categories.`);
