import fs from "node:fs";
import path from "node:path";
import type { QuestionAnalysis } from "./analyzer";
import { loadHistory, getTodayAnswerCount, isDuplicateQuestion } from "./history";

export interface CheckResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    charCountWithoutLink: number;
    linkCount: number;
    todayAnswers: number;
    maxDailyCadence: number;
  };
}

export function checkKinAnswer(params: {
  analysis: QuestionAnalysis;
  answerText: string;
  questionUrl?: string;
  articleSlug: string;
}): CheckResult {
  const configPath = path.resolve(process.cwd(), "data/jisikin-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  const errors: string[] = [];
  const warnings: string[] = [];

  const text = params.answerText.trim();
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const foundUrls = text.match(urlRegex) || [];

  // 1. 링크 뺀 본문 글자수
  let textWithoutLinks = text;
  foundUrls.forEach(u => {
    textWithoutLinks = textWithoutLinks.replace(u, "");
  });
  const charCount = textWithoutLinks.trim().length;

  if (charCount < config.minAnswerLength) {
    errors.push(`본문 글자수 부족 (${charCount}자 / 최소 ${config.minAnswerLength}자 필요). 등록 불가.`);
  }

  // 2. 링크 개수 및 도메인 검사
  if (foundUrls.length > config.maxAnswerLinks) {
    errors.push(`링크가 ${foundUrls.length}개 포함되어 있습니다 (최대 1개 허용). 등록 불가.`);
  }

  for (const link of foundUrls) {
    for (const disallowed of config.disallowedDomains) {
      if (link.includes(disallowed)) {
        errors.push(`제휴/단축 링크(${disallowed}) 삽입 금지. 등록 불가.`);
      }
    }
    if (!link.startsWith(config.siteUrl)) {
      warnings.push(`자사 사이트(${config.siteUrl})가 아닌 외부 링크가 포함되어 있습니다: ${link}`);
    }
  }

  // 3. 상투적 인사말 및 스팸 문구 검사
  for (const greeting of config.disallowedGreetings) {
    if (text.includes(greeting)) {
      errors.push(`기계식 상투 인사말("${greeting}")이 포함되어 있습니다. 네이버 필터링 방지를 위해 제거하세요.`);
    }
  }

  // 4. 질문자 필수 조건 반영 여부
  if (params.analysis.floor && !text.includes(params.analysis.floor) && !text.includes("층")) {
    errors.push(`질문자의 필수 조건인 '${params.analysis.floor}'에 대한 답변이 누락되었습니다.`);
  }
  if (params.analysis.hasElevator === false && !text.includes("엘리베이터") && !text.includes("계단") && !text.includes("사다리차")) {
    errors.push("질문자의 '엘리베이터 없음' 조건에 대한 해결책(사다리차 또는 계단 작업)이 누락되었습니다.");
  }

  // 5. 카덴스 검사 (하루 최대 등록 수)
  const todayCount = getTodayAnswerCount();
  if (todayCount >= config.maxDailyCadence) {
    errors.push(`오늘 이미 ${todayCount}건 답변을 등록했습니다 (하루 한도: ${config.maxDailyCadence}건). 어뷰징 방지를 위해 내일 진행하세요.`);
  }

  // 6. 중복 답변 검사
  if (params.questionUrl && isDuplicateQuestion(params.questionUrl, params.analysis.title)) {
    errors.push(`이미 과거에 답변한 질문 URL/질문입니다 (${params.questionUrl}). 중복 답변 불가.`);
  }

  // 7. 이전 답변과의 유사도 검사
  const history = loadHistory();
  if (history.length > 0) {
    const firstSentence = text.split("\n")[0].trim();
    for (const h of history) {
      const prevFirst = h.answer.split("\n")[0].trim();
      if (firstSentence === prevFirst) {
        errors.push("이전 답변의 첫 문장과 100% 동일합니다. 질문자 맞춤형 문장으로 변경하세요.");
        break;
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    stats: {
      charCountWithoutLink: charCount,
      linkCount: foundUrls.length,
      todayAnswers: todayCount,
      maxDailyCadence: config.maxDailyCadence
    }
  };
}
