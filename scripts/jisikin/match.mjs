// 한국어 검색어는 띄어쓰기가 들쭉날쭉하고("천안원룸이사예약" vs "천안 원룸 이사"),
// 지식인 질문은 구어체 어미가 길게 붙는다("포장이사 견적 얼마나 나오나요").
// 그래서 형태소 분석 대신 (1) 질문 어미 제거 (2) 공백 제거 후 글자 2-gram
// (3) 양방향 겹침으로 점수를 낸다.

const QUESTION_TAILS = [
  "알려주세요", "알려주실", "궁금합니다", "궁금해요", "궁금한데요", "궁금한데", "부탁드립니다", "부탁드려요",
  "어떻게하나요", "어떻게해야하나요", "어떻게되나요", "어떡하나요", "어쩌죠", "어떤가요", "어떨까요",
  "인가요", "일까요", "할까요", "될까요", "하나요", "되나요", "있나요", "없나요", "맞나요", "나요",
  "인지요", "인지", "건가요", "가요", "해요", "해야", "해도", "하면", "인데", "한데", "요",
];

const NOISE = ["질문", "답변", "제발", "급해요", "급함", "ㅠㅠ", "ㅜㅜ", "ㅎㅎ", "please"];

function stripTails(value) {
  let text = String(value ?? "");
  for (const noise of NOISE) text = text.replaceAll(noise, " ");
  // 어미는 긴 것부터 지워야 "하나요"가 "요"로 잘려나가지 않는다.
  for (const tail of QUESTION_TAILS) {
    text = text.replace(new RegExp(`${tail}(?=[\\s?!.,]|$)`, "gu"), " ");
  }
  return text;
}

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^가-힣a-z0-9]+/gu, "");
}

function bigrams(value) {
  const text = normalize(value);
  const set = new Set();
  if (text.length === 1) set.add(text);
  for (let i = 0; i < text.length - 1; i += 1) set.add(text.slice(i, i + 2));
  return set;
}

/**
 * 624개 글의 대부분이 "이사"를 공유한다. 흔한 조각에 같은 무게를 주면
 * 지역 글이 통째로 떠올라 일반 글을 밀어낸다. 문서빈도로 가중치를 깎는다.
 */
let idf = new Map();
let idfFloor = 1;

export function buildIdf(index) {
  const df = new Map();
  for (const article of index) {
    const seen = bigrams(
      `${article.keyword} ${article.title} ${article.secondaryKeywords.join(" ")} ${article.headings.join(" ")}`,
    );
    for (const gram of seen) df.set(gram, (df.get(gram) ?? 0) + 1);
  }
  const total = Math.max(index.length, 1);
  idf = new Map([...df].map(([gram, count]) => [gram, Math.log(total / count) + 0.15]));
  idfFloor = Math.log(total) + 0.15;
  return idf;
}

function weightOf(gram) {
  // 인덱스에 없는 조각은 그 사이트에서 가장 희귀한 것으로 본다.
  return idf.get(gram) ?? idfFloor;
}

function overlap(source, target) {
  if (source.size === 0) return 0;
  let hit = 0;
  let all = 0;
  for (const gram of source) {
    const weight = weightOf(gram);
    all += weight;
    if (target.has(gram)) hit += weight;
  }
  return all === 0 ? 0 : hit / all;
}

/**
 * 질의→필드 겹침과 필드→질의 겹침 중 큰 쪽을 쓴다.
 * 긴 질문에서는 필드가 질의에 통째로 들어가는(역방향) 경우가 실제 일치다.
 */
function bidirectional(queryGrams, fieldText) {
  const field = bigrams(fieldText);
  if (field.size === 0) return 0;
  return Math.max(overlap(queryGrams, field), overlap(field, queryGrams));
}

const FIELD_WEIGHTS = [
  ["keyword", 0.3],
  ["title", 0.24],
  ["secondaryKeywords", 0.16],
  ["headings", 0.12],
  ["faq", 0.1],
  ["description", 0.08],
];

export function scoreArticle(query, article) {
  const cleaned = stripTails(query);
  const grams = bigrams(cleaned);

  const fields = {
    keyword: article.keyword,
    title: article.title,
    secondaryKeywords: article.secondaryKeywords.join(" "),
    headings: article.headings.join(" "),
    faq: article.faq.map((item) => item.question).join(" "),
    description: article.description,
  };

  let score = 0;
  const detail = {};
  for (const [field, weight] of FIELD_WEIGHTS) {
    const value = field === "keyword" || field === "secondaryKeywords"
      ? bidirectional(grams, fields[field])
      : overlap(grams, bigrams(fields[field]));
    detail[field] = Number(value.toFixed(3));
    score += value * weight;
  }

  const normalizedQuery = normalize(cleaned);
  if (normalizedQuery.length >= 4) {
    if (normalize(article.keyword).includes(normalizedQuery)) score += 0.18;
    else if (normalize(article.title).includes(normalizedQuery)) score += 0.12;
  }

  return { score: Number(Math.min(score, 1).toFixed(4)), detail, cleanedQuery: cleaned.trim() };
}

export function rankArticles(query, index, limit = 5) {
  if (idf.size === 0) buildIdf(index);
  return index
    .map((article) => ({ article, ...scoreArticle(query, article) }))
    .sort((a, b) => b.score - a.score || b.article.updatedAt.localeCompare(a.article.updatedAt))
    .slice(0, limit);
}

/**
 * 판정은 '보조 신호'다. 최종 검색 의도 판단은 사람/에이전트가 한다.
 * (기준문서 §4·§5 — 키워드가 다르다는 이유만으로 새 글을 만들지 않는다)
 *
 * covered   : 기존 글로 바로 답변 가능
 * weak      : 관련 글은 있으나 의도가 어긋날 수 있음 → 기존 글 강화부터 검토
 * uncovered : 새 글 필요 후보
 */
export function classify(ranked, config) {
  const best = ranked[0];
  if (!best) return { verdict: "uncovered", best: null, ranked };
  if (best.score >= config.strongMatchThreshold) return { verdict: "covered", best, ranked };
  if (best.score >= config.matchThreshold) return { verdict: "weak", best, ranked };
  return { verdict: "uncovered", best, ranked };
}
