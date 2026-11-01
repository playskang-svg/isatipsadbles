#!/usr/bin/env node
/**
 * 지역 집수리 페이지 검사기. 실행: npm run audit:local
 * - 서비스 모듈의 분량, 금지어, 금액 표기, 링크 키를 본다.
 * - 페이지 제목·설명 중복과 본문 유사도(70% 초과면 실패)를 본다.
 * - 쿠팡 발급 대상 검색어를 data/coupang-queries.json으로 내보낸다.
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";

const { serviceModules, localRepairArticles } = await import("../lib/local-repair/pages.ts");
const { supplyQueries } = await import("../lib/affiliate-match.ts");
const { shoppingGuides } = await import("../lib/shopping.ts");
const { coupangUrl } = await import("../lib/coupang-links.ts");
const prices = JSON.parse(readFileSync(new URL("../data/soomgo-prices.json", import.meta.url), "utf8")).prices;
const affiliate = JSON.parse(readFileSync(new URL("../data/affiliate-links.json", import.meta.url), "utf8"));
const linkKeys = new Map(affiliate.links.map((l) => [l.key, l]));

const errors = [];
const warnings = [];
const BANNED = /최저가|1등|100%|무조건|완벽|무료 시공|전문 업체|저희|오늘만|선착순|놀라운|혁신/u;
const MONEY = /\d[\d,]*\s*(원|만원|만 원|천원|천 원)/u;
const MARKDOWN = /\*\*|^#|\]\(/mu;
const REGION = /인천|천안|용인|평택|송도|청라|검단|부평|기흥|고덕|불당/u;

const ids = new Set(serviceModules.map((m) => m.id));
const sizes = { symptoms: [3, 7], decisions: [3, 6], options: [2, 5], costFactors: [4, 8], faq: [5, 8], ask: [3, 6], mistakes: [2, 5] };

function allText(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allText);
  if (value && typeof value === "object") return Object.entries(value).filter(([k]) => !["quoteKey", "priceKey", "hero", "related", "guide", "id"].includes(k)).flatMap(([, v]) => allText(v));
  return [];
}

for (const m of serviceModules) {
  for (const [field, [min, max]] of Object.entries(sizes)) {
    const n = m[field]?.length ?? 0;
    if (n < min || n > max) warnings.push(`${m.id}: ${field} ${n}개 (기준 ${min}~${max})`);
  }
  if ((m.self?.steps?.length ?? 0) < 3) errors.push(`${m.id}: self.steps 부족`);
  if ((m.self?.materials?.length ?? 0) < 2) errors.push(`${m.id}: self.materials 부족`);
  if ((m.self?.stop?.length ?? 0) < 2) errors.push(`${m.id}: self.stop 부족`);
  if (!linkKeys.has(m.quoteKey) || linkKeys.get(m.quoteKey).status === "retired") errors.push(`${m.id}: quoteKey 없음 ${m.quoteKey}`);
  if (m.priceKey && !prices[m.priceKey]) errors.push(`${m.id}: priceKey 없음 ${m.priceKey}`);
  for (const id of m.related ?? []) if (!ids.has(id)) errors.push(`${m.id}: related 없음 ${id}`);
  if (!existsSync(new URL(`../public${m.hero.src}`, import.meta.url))) errors.push(`${m.id}: 이미지 없음 ${m.hero.src}`);
  for (const text of allText(m)) {
    if (BANNED.test(text)) errors.push(`${m.id}: 금지어 "${text.match(BANNED)[0]}" — ${text.slice(0, 60)}`);
    if (MONEY.test(text)) errors.push(`${m.id}: 금액 표기 — ${text.slice(0, 60)}`);
    if (MARKDOWN.test(text)) errors.push(`${m.id}: 마크다운 — ${text.slice(0, 60)}`);
    if (REGION.test(text)) errors.push(`${m.id}: 지역명 — ${text.slice(0, 60)}`);
  }
}

// 쿠팡 발급 대상
const queries = new Set(supplyQueries);
for (const m of serviceModules) for (const item of m.self.materials) queries.add(item.q);
for (const guide of Object.values(shoppingGuides)) for (const item of guide.suggestions) queries.add(item.keyword);
writeFileSync(new URL("../data/coupang-queries.json", import.meta.url), JSON.stringify([...queries], null, 1) + "\n");
const missing = [...queries].filter((q) => !coupangUrl(q));

// 페이지 검사
const titles = new Map();
const descriptions = new Map();
for (const a of localRepairArticles) {
  if (titles.has(a.title)) errors.push(`제목 중복: ${a.title}`);
  titles.set(a.title, a.slug);
  if (descriptions.has(a.description)) errors.push(`설명 중복: ${a.description.slice(0, 40)}`);
  descriptions.set(a.description, a.slug);
  if (a.description.length < 40) errors.push(`설명이 짧음: ${a.slug}`);
  if (a.title.length > 45) warnings.push(`제목이 김(${a.title.length}자): ${a.title}`);
}

function bodyOf(article) {
  return [article.intro, ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.checklist ?? []), ...(s.steps ?? []), ...(s.stopList ?? []), ...(s.table?.rows.flat() ?? [])]), ...article.faq.flatMap((f) => [f.question, f.answer])].join(" ");
}
function shingles(text, n = 4) {
  const words = text.replace(/[^가-힣A-Za-z0-9 ]/gu, " ").split(/\s+/u).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + n <= words.length; i += 1) set.add(words.slice(i, i + n).join(" "));
  return set;
}
function jaccard(a, b) {
  let shared = 0;
  for (const item of a) if (b.has(item)) shared += 1;
  return shared / (a.size + b.size - shared || 1);
}
const bodies = localRepairArticles.map((a) => ({ slug: a.slug, group: a.slug.split("-").pop(), set: shingles(bodyOf(a)), len: bodyOf(a).length }));
const byGroup = new Map();
for (const b of bodies) { const list = byGroup.get(b.group) ?? []; list.push(b); byGroup.set(b.group, list); }
let worst = { score: 0 };
let over55 = 0;
for (const list of byGroup.values()) {
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const score = jaccard(list[i].set, list[j].set);
      if (score > worst.score) worst = { score, a: list[i].slug, b: list[j].slug };
      if (score > 0.7) errors.push(`유사도 ${Math.round(score * 100)}%: ${list[i].slug} / ${list[j].slug}`);
      else if (score > 0.55) over55 += 1;
    }
  }
}
const lens = bodies.map((b) => b.len).sort((a, b) => a - b);

console.log(`모듈 ${serviceModules.length}개, 페이지 ${localRepairArticles.length}개`);
console.log(`본문 글자 수 최소 ${lens[0]}, 중앙 ${lens[Math.floor(lens.length / 2)]}, 최대 ${lens[lens.length - 1]}`);
console.log(`같은 작업끼리 최고 유사도 ${Math.round(worst.score * 100)}% (${worst.a} / ${worst.b}), 55~70% ${over55}쌍`);
console.log(`쿠팡 검색어 ${queries.size}개, 미발급 ${missing.length}개`);
if (warnings.length) console.log(`경고 ${warnings.length}건\n` + warnings.slice(0, 30).join("\n"));
if (errors.length) {
  console.error(`오류 ${errors.length}건\n` + errors.slice(0, 60).join("\n"));
  process.exit(1);
}
console.log("검사 통과");
