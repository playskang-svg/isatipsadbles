// 답변 문안은 Claude가 쓴다. 이 파일은 (1) 답변 근거를 뽑아주고
// (2) 쓴 답변이 발행 가능한지 기계적으로 검사한다.
// 네이버 지식인 운영정책과 기준문서 §7(사실성)·§12(수익화)에서 나온 규칙이다.

const ADVERT_PATTERNS = [
  [/무조건/u, "단정형 표현 '무조건'"],
  [/100\s*%|백퍼|100퍼/u, "단정형 표현 '100%'"],
  [/최저가|최저 가격|가장 싼/u, "가격 단정 표현"],
  [/강력\s*추천|강추/u, "광고성 표현"],
  [/문의\s*주세요|상담\s*주세요|연락\s*주세요|010[-\s]?\d{3,4}/u, "영업·연락 유도"],
  [/클릭\s*하세요|여기를?\s*클릭|바로가기/u, "클릭 유도 문구"],
  [/카톡|카카오톡\s*아이디|오픈채팅/u, "외부 연락 유도"],
];

// 답변이 회를 거듭하며 서로 닮아가는 것이 봇으로 잡히는 가장 흔한 신호다.
// 아래는 그 자체로 나쁘진 않지만 매번 반복되면 형식이 드러나는 상투구다.
const FILLER_PHRASES = [
  "도움이 되셨으면", "도움이 되길", "참고하시기 바랍니다", "참고하시면 좋겠습니다",
  "정리하자면", "결론적으로 말씀드리면", "아래 링크", "링크를 참고", "자세한 내용은",
  "좋은 결과 있으시길", "화이팅", "성공적인 이사",
];

// 인사·서두·자기소개는 지식인 답변에서 순수한 사족이다. 첫 문장부터 답이어야 한다.
const OPENING_FILLER = [
  /^\s*안녕하세요/u, /^\s*반갑습니다/u, /^\s*질문\s*(?:잘\s*)?(?:읽|봤)/u,
  /^\s*저도\s*예전에\s*비슷/u, /^\s*우선\s*답변\s*드리/u,
];

// 문장에 이 중 하나도 없으면 "누구에게나 할 수 있는 말"일 가능성이 높다.
const SPECIFIC_SIGNAL = /[0-9]|층|평|엘리베이터|사다리차|계단|원룸|투룸|오피스텔|아파트|빌라|주차|견적서|계약서|관리사무소|보증금|전입신고|배관|실외기|타공|보양|용달|반포장|포장이사|잔금|영수증|사진|계량기|일정|주말|평일|사고증명서|표준약관|소비자원|피해구제|분쟁조정|내용증명|통지|영수증|완충재|뽁뽁이|박스|약관|기한|인도|접수/u;

// 조건을 언급만 하고 넘어가면 답이 아니다. 조건마다 나와야 할 해결책 어휘를 정해둔다.
const SOLUTION_REQUIRED = [
  { when: /엘리베이터\s*(?:가\s*)?없|엘베\s*없|계단으로|계단 이용/u, need: /사다리차|계단|인력|인원|분해|호이스트/u,
    label: "엘리베이터 없음 → 사다리차·계단·인력 중 무엇으로 올릴지" },
  { when: /사다리차/u, need: /지지대|주차|도로|전선|각도|진입|계단/u,
    label: "사다리차 → 설치 공간·진입 조건" },
  { when: /파손|깨졌|깨짐|분실/u, need: /사고증명서|통지|보상|배상|사진|소비자원|약관/u,
    label: "파손·분실 → 접수 절차" },
];

const NUMBER_CLAIM = /\d[\d,]*\s*(?:만\s*원|원|만원|퍼센트|%)/gu;
const HEDGE = /(달라질 수|다를 수|차이가 있을 수|업체|조건에 따라|기준으로|확인해|문의해)/u;

function shingles(text, size = 4) {
  const normalized = String(text).replace(/https?:\/\/[^\s]+/gu, " ").replace(/[^가-힣a-z0-9]+/giu, "");
  const set = new Set();
  for (let i = 0; i <= normalized.length - size; i += 1) set.add(normalized.slice(i, i + size));
  return set;
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const gram of a) if (b.has(gram)) shared += 1;
  return shared / (a.size + b.size - shared);
}

function firstSentence(text) {
  return bodyWithoutLinks(text).split(/(?<=[.!?])\s+/u)[0]?.slice(0, 40) ?? "";
}

/**
 * 이전 답변들과 얼마나 닮았는지 잰다.
 * 문장 단위가 아니라 글자 4-gram으로 재기 때문에 어순만 바꾼 재탕도 걸린다.
 */
export function templateRisk(text, previousAnswers = []) {
  const current = shingles(text);
  let worst = { similarity: 0, questionId: null };

  for (const previous of previousAnswers) {
    const similarity = jaccard(current, shingles(previous.answerText ?? ""));
    if (similarity > worst.similarity) worst = { similarity, questionId: previous.questionId ?? null };
  }

  const opening = firstSentence(text);
  const repeatedOpening = opening.length >= 10
    && previousAnswers.filter((previous) => firstSentence(previous.answerText ?? "") === opening).length;

  const fillers = FILLER_PHRASES.filter((phrase) => text.includes(phrase));

  return {
    similarity: Number(worst.similarity.toFixed(3)),
    closestQuestionId: worst.questionId,
    repeatedOpening: Number(repeatedOpening) || 0,
    fillers,
  };
}

export function extractLinks(text) {
  return [...String(text).matchAll(/https?:\/\/[^\s<>()[\]"']+/gu)].map((match) => match[0]);
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

/** 링크를 걷어낸 알맹이. 링크 없이도 답이 되는지 재는 기준. */
export function bodyWithoutLinks(text) {
  return String(text).replace(/https?:\/\/[^\s<>()[\]"']+/gu, " ").replace(/\s+/gu, " ").trim();
}

/**
 * 발행 가능 여부 검사.
 * blocking 하나라도 있으면 등록하지 않는다. warning은 사람이 판단한다.
 */
export function validateAnswer(text, config, context = {}) {
  const blocking = [];
  const warnings = [];

  const links = extractLinks(text);
  const body = bodyWithoutLinks(text);

  if (body.length < config.minAnswerChars) {
    blocking.push(
      `링크를 뺀 본문이 ${body.length}자입니다. 최소 ${config.minAnswerChars}자 — 링크 없이도 답이 되어야 합니다.`,
    );
  }

  if (links.length > config.maxLinksPerAnswer) {
    blocking.push(`링크가 ${links.length}개입니다. 답변당 최대 ${config.maxLinksPerAnswer}개.`);
  }

  for (const link of links) {
    const host = hostOf(link);
    if (config.blockedLinkHosts.includes(host)) {
      blocking.push(`제휴 링크(${host})를 지식인 답변에 직접 넣을 수 없습니다. 사이트 글로만 연결하세요.`);
    } else if (!config.allowedLinkHosts.includes(host)) {
      warnings.push(`허용 목록에 없는 링크입니다: ${host}`);
    }
  }

  if (context.expectedUrl && links.length > 0 && !links.includes(context.expectedUrl)) {
    warnings.push(`매칭된 글(${context.expectedUrl})과 다른 주소가 들어 있습니다.`);
  }

  for (const [pattern, label] of ADVERT_PATTERNS) {
    if (pattern.test(text)) blocking.push(`광고·단정 표현: ${label}`);
  }

  // 금액·비율은 출처 없이 단정하지 않는다(기준문서 §7).
  const claims = [...String(text).matchAll(NUMBER_CLAIM)].map((match) => match[0]);
  if (claims.length > 0 && !HEDGE.test(text)) {
    warnings.push(`금액·비율 표현(${claims.join(", ")})이 있는데 조건 단서가 없습니다. 확인된 값만 쓰거나 범위를 조건과 함께 적으세요.`);
  }

  // 위치 무관 금지어 — 채택 구걸과 맺음 인사는 어디에 있든 기계식으로 읽힌다
  for (const phrase of config.bannedAnywhere ?? []) {
    if (text.includes(phrase)) blocking.push(`금지 문구: "${phrase}"`);
  }

  // 사족 감시 (사용자 요청: 정말 도움이 되는 말만)
  for (const pattern of OPENING_FILLER) {
    if (pattern.test(body)) {
      blocking.push("인사·서두로 시작합니다. 첫 문장부터 질문에 답하세요.");
      break;
    }
  }

  const sentences = body.split(/(?<=[.!?])\s+|(?<=다\.)\s*/u).map((item) => item.trim()).filter((item) => item.length >= 8);
  if (sentences.length >= 4) {
    const empty = sentences.filter((sentence) => !SPECIFIC_SIGNAL.test(sentence));
    if (empty.length / sentences.length > 0.5) {
      warnings.push(
        `구체적인 정보가 없는 문장이 ${empty.length}/${sentences.length}개입니다. 예: "${empty[0].slice(0, 30)}…"`,
      );
    }
  }

  // 템플릿화 감시 (사용자 요청: 답변이 찍어낸 것처럼 보이지 않게)
  const risk = templateRisk(text, context.previousAnswers ?? []);
  if (risk.similarity >= 0.5) {
    blocking.push(
      `이전 답변과 ${Math.round(risk.similarity * 100)}% 겹칩니다(${risk.closestQuestionId}). 이 질문에만 해당하는 내용으로 다시 쓰세요.`,
    );
  } else if (risk.similarity >= 0.32) {
    warnings.push(`이전 답변과 ${Math.round(risk.similarity * 100)}% 겹칩니다(${risk.closestQuestionId}). 구성과 예시를 바꾸세요.`);
  }
  if (risk.repeatedOpening > 0) {
    blocking.push(`첫 문장이 이전 답변 ${risk.repeatedOpening}건과 같습니다. 질문마다 다른 문장으로 시작하세요.`);
  }
  if (risk.fillers.length >= 2) {
    warnings.push(`상투구가 ${risk.fillers.length}개 있습니다: ${risk.fillers.join(", ")}`);
  }

  if (context.questionText) {
    const focus = questionFocus(context.questionText);
    const covered = focus.terms.filter((term) => body.includes(term));
    const missingConditions = focus.conditions.filter((item) => item.value && !body.includes(item.value));

    if (focus.terms.length >= 3 && covered.length / focus.terms.length < 0.25) {
      blocking.push(
        `질문에 적힌 조건을 거의 다루지 않았습니다. 언급되지 않은 말: ${focus.terms.filter((term) => !covered.includes(term)).slice(0, 8).join(", ")}`,
      );
    }
    if (missingConditions.length > 0) {
      warnings.push(
        `질문자가 밝힌 조건이 답변에 없습니다: ${missingConditions.map((item) => `${item.label}(${item.value})`).join(", ")}`,
      );
    }

    for (const rule of SOLUTION_REQUIRED) {
      if (rule.when.test(context.questionText) && !rule.need.test(body)) {
        blocking.push(`조건에 대한 해결책이 없습니다 — ${rule.label}`);
      }
    }

    const question = context.questionText.replace(/\s+/gu, "");
    const answer = body.replace(/\s+/gu, "");
    if (question.length >= 20 && answer.includes(question)) {
      warnings.push("질문 문장을 그대로 옮겨 적었습니다. 답부터 쓰세요.");
    }
  }

  return {
    ok: blocking.length === 0,
    blocking,
    warnings,
    linkCount: links.length,
    bodyChars: body.length,
    templateRisk: risk,
    focus: context.questionText ? questionFocus(context.questionText) : null,
  };
}

// 질문자가 답변을 지우는 가장 흔한 이유는 "내 상황에 대한 답이 아니어서"다.
// 일반론만 늘어놓지 않도록, 질문에 적힌 구체 조건을 뽑아 답변이 그걸 다루는지 본다.
const GENERIC = new Set([
  "이사", "질문", "답변", "궁금", "부탁", "정도", "생각", "경우", "때문", "그런데", "혹시",
  "지금", "다른", "많이", "조금", "정말", "제가", "저는", "해서", "하는", "있는", "같은", "어떻게",
]);

// 한국어 조건절이 거의 다 -면으로 끝나서 "받으려면"이 지역명으로 잡힌다.
// 정규식으로 가르려다 더 틀렸다. 후보를 뽑고 어미를 걸러내는 편이 정확하다.
const NOT_A_PLACE = /(?:으려면|하려면|려면|으면|하면|되면|라면|다면|이면|시면|보면|가면|주면|지면|오면|리면|기면|되구|이구)$/u;

function detectRegion(text) {
  // 조사가 붙어도 잡아야 한다("성정동으로", "서북구에서").
  const candidates = String(text).match(/[가-힣]{2,4}(?:시|군|구|동|읍|면)(?=$|[^가-힣]|에|으로|로|은|는|이|가|을|를|과|와|부터|까지)/gu) ?? [];
  return candidates.find((value) => !NOT_A_PLACE.test(value));
}

const CONDITION_HINTS = [
  [/(\d+)\s*층/u, "층수"],
  [/(\d+)\s*평|(\d+)\s*㎡/u, "평수"],
  [/원룸|투룸|오피스텔|아파트|빌라|단독주택/u, "주거 형태"],
  [/엘리베이터|승강기|사다리차|계단/u, "운반 조건"],
  [/(\d+)\s*(?:월|일)|다음\s*주|이번\s*주|주말|평일/u, "일정"],
  [detectRegion, "지역"],
  [/혼자|가족|신혼|아이|반려|고양이|강아지/u, "동거 조건"],
  [/짐이?\s*(?:적|많)|박스\s*\d+/u, "짐의 양"],
];

/** 질문에서 답변이 반드시 받아야 할 구체 조건을 뽑는다. */
export function questionFocus(questionText) {
  const text = String(questionText ?? "");
  const conditions = CONDITION_HINTS
    .map(([matcher, label]) => ({
      label,
      value: typeof matcher === "function" ? matcher(text) : text.match(matcher)?.[0]?.trim(),
    }))
    .filter((item) => Boolean(item.value));

  const terms = [...new Set(
    text.replace(/[^가-힣a-z0-9\s]/giu, " ")
      .split(/\s+/u)
      .map((term) => term.replace(/(?:이|가|은|는|을|를|에서|에게|으로|로|과|와|도|만|의)$/u, ""))
      .filter((term) => term.length >= 2 && !GENERIC.has(term)),
  )];

  return { conditions, terms };
}

/** 매칭된 글에서 이 질문에 실제로 답이 되는 대목만 골라준다. */
export function evidenceFrom(article, query) {
  if (!article) return null;
  const terms = String(query).replace(/[^가-힣a-z0-9\s]/giu, " ").split(/\s+/u).filter((term) => term.length >= 2);
  const hits = (text) => terms.reduce((count, term) => (String(text).includes(term) ? count + 1 : count), 0);

  const sections = (article.sections ?? [])
    .map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
      checklist: section.checklist ?? [],
      score: hits(`${section.heading} ${section.paragraphs.join(" ")}`),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const faq = (article.faq ?? [])
    .map((item) => ({ ...item, score: hits(`${item.question} ${item.answer}`) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { intro: article.intro, sections, faq, source: article.source ?? null };
}
