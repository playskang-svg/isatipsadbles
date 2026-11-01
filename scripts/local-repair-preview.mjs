#!/usr/bin/env node
// 지역 집수리 페이지를 글자로 뽑아 읽어 본다. 사용: node --import ./scripts/jisikin/register.mjs scripts/local-repair-preview.mjs 인천-청라-방충망
const { localRepairArticles } = await import("../lib/local-repair/pages.ts");
for (const slug of process.argv.slice(2)) {
  const a = localRepairArticles.find((item) => item.slug === slug);
  if (!a) { console.log("없음", slug); continue; }
  console.log(`# ${a.title}\n${a.description}\n공개 ${a.publishedAt}\n\n${a.intro}\n`);
  for (const s of a.sections) {
    console.log(`## ${s.heading}`);
    for (const p of s.paragraphs) console.log(p);
    if (s.table) console.log([s.table.head.join(" | "), ...s.table.rows.map((r) => r.join(" | "))].join("\n"));
    if (s.steps) console.log(s.steps.map((x, i) => `${i + 1}. ${x}`).join("\n"));
    if (s.materials) console.log("준비물: " + s.materials.map((m) => `${m.q}(${m.why})`).join(", "));
    if (s.stopList) console.log("멈춤: " + s.stopList.join(" / "));
    if (s.checklist) console.log("확인: " + s.checklist.join(" / "));
    console.log();
  }
  console.log("FAQ");
  for (const f of a.faq) console.log(`Q ${f.question}\nA ${f.answer}`);
  console.log(`\nCTA: ${a.cta?.title} / ${a.cta?.buttonLabel}\n배너: ${a.quoteBanner?.headline ?? "-"}\n출처: ${(a.sources ?? []).map((x) => x.label).join(", ")}\n관련: ${(a.relatedSlugs ?? []).join(", ")}\n`);
}
