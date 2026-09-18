#!/usr/bin/env node
// 지식인 답변 에이전트 — 검색·매칭·가드레일 도구.
// 답변 문안 작성은 Claude가 한다. 운영 기준은 docs/JISIKIN_ANSWER_AGENT.md.
//
//   npm run kin -- status
//   npm run kin -- match --q "천안 원룸이사 견적 얼마나 하나요"
//   npm run kin -- check --q "..." --file draft.txt --article cheonan-seobuk-gu-moving
//   npm run kin -- record --url "https://kin.naver.com/qna/detail.naver?docId=123" --article <slug> --file draft.txt
import { readFileSync } from "node:fs";
import { buildIndex, loadArticleBody } from "./site/index-build.mjs";
import { rankArticles, classify } from "./site/match.mjs";
import { validateAnswer, evidenceFrom } from "./jisikin/answer.mjs";
import { loadConfig, articleUrl } from "./jisikin/config.mjs";
import { readLog, writeLog, appendEntry, alreadyAnswered, answeredToday, questionId } from "./jisikin/store.mjs";

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = {};
  for (let i = 0; i < rest.length; i += 1) {
    if (!rest[i].startsWith("--")) continue;
    const key = rest[i].slice(2);
    const next = rest[i + 1];
    if (next === undefined || next.startsWith("--")) flags[key] = true;
    else { flags[key] = next; i += 1; }
  }
  return { command, flags };
}

function readDraft(flags) {
  if (flags.file) return readFileSync(flags.file, "utf8");
  if (flags.text) return String(flags.text);
  throw new Error("--file 또는 --text 로 답변 초안을 넘기세요.");
}

const VERDICT_LABEL = {
  covered: "기존 글로 답변 가능",
  weak: "관련 글 있음 — 검색 의도 직접 확인 필요",
  uncovered: "새 글 필요 후보",
};

async function cmdStatus(config) {
  const index = await buildIndex();
  const log = readLog();
  const today = answeredToday(log);
  console.log(`인덱스: 발행글 ${index.length}건`);
  console.log(`오늘 등록: ${today} / ${config.dailyAnswerLimit}건${today >= config.dailyAnswerLimit ? "  ← 한도 도달" : ""}`);
  console.log(`누적 기록: ${log.entries.length}건`);
  console.log("\n우선 키워드 (서치어드바이저 노출 기준):");
  for (const target of config.targetKeywords) {
    console.log(`  [${target.priority}] ${target.keyword}  — ${target.why}`);
  }
}

async function cmdMatch(config, flags) {
  const query = flags.q ?? flags.question;
  if (!query) throw new Error("--q \"질문 내용\" 이 필요합니다.");

  const index = await buildIndex();
  const ranked = rankArticles(query, index, Number(flags.limit ?? 5));
  const result = classify(ranked, config);
  const log = readLog();

  const duplicate = flags.url ? alreadyAnswered(log, flags.url) : null;
  const evidence = result.best && result.verdict !== "uncovered"
    ? evidenceFrom(await loadArticleBody(result.best.article.slug), query)
    : null;

  const payload = {
    query,
    verdict: result.verdict,
    verdictLabel: VERDICT_LABEL[result.verdict],
    cadence: { today: answeredToday(log), limit: config.dailyAnswerLimit },
    duplicate,
    candidates: ranked.map((item) => ({
      score: item.score,
      slug: item.article.slug,
      title: item.article.title,
      url: item.article.url,
      keyword: item.article.keyword,
      category: item.article.categoryLabel,
      updatedAt: item.article.updatedAt,
    })),
    evidence,
  };

  if (flags.json) { console.log(JSON.stringify(payload, null, 2)); return; }

  console.log(`질문: ${query}`);
  console.log(`판정: ${result.verdict} — ${VERDICT_LABEL[result.verdict]}`);
  if (duplicate) console.log(`이미 답변한 질문입니다 (${duplicate.recordedAt}, ${duplicate.status}).`);
  console.log(`오늘 등록 ${payload.cadence.today}/${payload.cadence.limit}건\n`);
  console.log("후보 글:");
  for (const candidate of payload.candidates) {
    console.log(`  ${candidate.score.toFixed(3)}  ${candidate.title}`);
    console.log(`         ${candidate.url}`);
  }
  if (evidence) {
    console.log("\n답변 근거로 쓸 대목:");
    for (const section of evidence.sections) {
      if (section.score === 0) continue;
      console.log(`  · ${section.heading}`);
      for (const paragraph of section.paragraphs) console.log(`      ${paragraph}`);
      for (const item of section.checklist) console.log(`      - ${item}`);
    }
    for (const item of evidence.faq) {
      if (item.score === 0) continue;
      console.log(`  Q. ${item.question}`);
      console.log(`  A. ${item.answer}`);
    }
    if (evidence.source) console.log(`\n  출처: ${evidence.source.label} — ${evidence.source.url}`);
  }
  console.log(`\n판정은 보조 신호입니다. 검색 의도가 실제로 같은지는 직접 확인하세요 (기준문서 §4·§5).`);
}

async function cmdCheck(config, flags) {
  const draft = readDraft(flags);
  const log = readLog();
  const previousAnswers = log.entries.filter((entry) => entry.answerText);

  let expectedUrl;
  if (flags.article) {
    const index = await buildIndex();
    expectedUrl = index.find((article) => article.slug === flags.article)?.url;
    if (!expectedUrl) throw new Error(`발행된 글에 ${flags.article} 슬러그가 없습니다.`);
  }

  const result = validateAnswer(draft, config, {
    expectedUrl,
    questionText: flags.q ?? flags.question,
    previousAnswers,
  });

  const today = answeredToday(log);
  if (today >= config.dailyAnswerLimit) {
    result.blocking.push(`오늘 ${today}건을 등록해 한도(${config.dailyAnswerLimit})에 도달했습니다.`);
    result.ok = false;
  }
  if (flags.url && alreadyAnswered(log, flags.url)) {
    result.blocking.push("이미 답변한 질문입니다.");
    result.ok = false;
  }

  if (flags.json) { console.log(JSON.stringify(result, null, 2)); process.exit(result.ok ? 0 : 1); }

  console.log(`본문 ${result.bodyChars}자 · 링크 ${result.linkCount}개 · 이전 답변 유사도 ${Math.round(result.templateRisk.similarity * 100)}%`);
  for (const item of result.blocking) console.log(`  [등록 불가] ${item}`);
  for (const item of result.warnings) console.log(`  [확인 필요] ${item}`);
  console.log(result.ok ? "\n등록 가능합니다. 마지막 승인은 사람이 합니다." : "\n등록할 수 없습니다. 위 항목을 고치세요.");
  process.exit(result.ok ? 0 : 1);
}

async function cmdRecord(config, flags) {
  if (!flags.url) throw new Error("--url 로 지식인 질문 주소를 넘기세요.");
  const log = readLog();
  if (alreadyAnswered(log, flags.url)) throw new Error("이미 기록된 질문입니다.");

  appendEntry(log, {
    questionId: questionId(flags.url),
    questionUrl: flags.url,
    questionText: flags.q ?? null,
    articleSlug: flags.article ?? null,
    articleUrl: flags.article ? articleUrl(flags.article) : null,
    answerText: flags.file || flags.text ? readDraft(flags) : null,
    status: flags.status ?? "posted",
    postedAt: new Date().toISOString(),
  });
  writeLog(log);
  console.log(`기록했습니다. 오늘 ${answeredToday(log)}/${config.dailyAnswerLimit}건.`);
}

const HELP = `지식인 답변 에이전트

  status                                   인덱스·카덴스·우선 키워드
  match  --q "질문" [--url ...] [--json]    기존 글 매칭과 답변 근거
  check  --q "질문" --file draft.txt        답변 초안 발행 가능 여부
         [--article <slug>] [--url ...]
  record --url <지식인 URL> --article <slug> --file draft.txt

기준: docs/JISIKIN_ANSWER_AGENT.md`;

const { command, flags } = parseArgs(process.argv.slice(2));
const config = loadConfig();

try {
  if (command === "status") await cmdStatus(config);
  else if (command === "match") await cmdMatch(config, flags);
  else if (command === "check") await cmdCheck(config, flags);
  else if (command === "record") await cmdRecord(config, flags);
  else console.log(HELP);
} catch (error) {
  console.error(`오류: ${error.message}`);
  process.exit(1);
}
