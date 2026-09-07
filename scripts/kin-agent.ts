import fs from "node:fs";
import path from "node:path";
import { analyzeQuestion } from "./kin/analyzer";
import { matchArticle } from "./kin/matcher";
import { generateAndSavePost } from "./kin/post-generator";
import { generateKinAnswer } from "./kin/answer-generator";
import { checkKinAnswer } from "./kin/checker";
import { loadHistory, saveHistory, getTodayAnswerCount } from "./kin/history";
import { getArticle } from "../lib/articles";

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";
  const params: Record<string, string> = {};

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].replace(/^--/, "");
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : "true";
      params[key] = val;
      if (val !== "true") i++;
    }
  }

  return { command, params };
}

async function main() {
  const { command, params } = parseArgs();

  switch (command) {
    case "status": {
      const config = JSON.parse(fs.readFileSync(path.resolve("data/jisikin-config.json"), "utf-8"));
      const todayCount = getTodayAnswerCount();
      console.log("\n📊 [네이버 지식iN 에이전트 운영 상태]");
      console.log(`- 사이트: ${config.siteName} (${config.siteUrl})`);
      console.log(`- 오늘 등록 완료 건수: ${todayCount}건 / 일일 제한: ${config.maxDailyCadence}건`);
      console.log(`- 잔여 등록 가능 건수: ${Math.max(0, config.maxDailyCadence - todayCount)}건`);
      console.log(`- 우선 타깃 키워드:\n  ${config.priorityKeywords.join(", ")}\n`);
      break;
    }

    case "scout": {
      const config = JSON.parse(fs.readFileSync(path.resolve("data/jisikin-config.json"), "utf-8"));
      console.log("\n🔥 [고유입 & 고채택 지식iN 타깃 키워드 스카우터]");
      console.log("사람들의 관심도가 가장 높고, 답변 채택률이 높은 10대 황금 키워드 목록입니다.\n");

      config.priorityKeywords.forEach((kw: string, idx: number) => {
        const searchUrl = `https://kin.naver.com/search/list.naver?query=${encodeURIComponent(kw)}&sort=date&section=kin`;
        console.log(`${idx + 1}. 🎯 ${kw}`);
        console.log(`   👉 실시간 최신 질문 바로가기: ${searchUrl}\n`);
      });

      console.log("--------------------------------------------------");
      console.log("🏆 [채택률 100% 질문 선별 가이드]");
      console.log("1. ⏱️ 등록 시간: 등록된 지 2시간 이내의 최신 질문");
      console.log("2. 💬 답변 수: 현재 등록된 답변이 0개 또는 1개뿐인 질문");
      console.log("3. 📝 질문 내용: '층수', '짐량', '엘리베이터 유무'가 구체적으로 적힌 진성 질문");
      console.log("--------------------------------------------------\n");
      break;
    }

    case "match": {
      const rawQ = params.q;
      if (!rawQ) {
        console.error("❌ --q '<질문 내용>' 인자가 필요합니다.");
        process.exit(1);
      }
      const analysis = analyzeQuestion(rawQ);
      const match = matchArticle(analysis);

      console.log("\n🔍 [질문 분석 결과]");
      console.log(`- 핵심 고민: ${analysis.coreProblem}`);
      console.log(`- 층수/엘베: ${analysis.floor || "미명시"} / ${analysis.hasElevator === false ? "엘리베이터 없음" : (analysis.hasElevator === true ? "엘리베이터 있음" : "미명시")}`);
      console.log(`- 이사 규모: ${analysis.loadSize || "미명시"}`);
      console.log(`- 주요 키워드: ${analysis.keywords.join(", ")}`);

      console.log("\n📑 [포스팅 매칭 판정]");
      if (match.hasMatch && match.bestArticle) {
        console.log(`✅ 적합한 기존 포스팅 발견! (점수: ${match.score}점)`);
        console.log(`- 제목: ${match.bestArticle.title}`);
        console.log(`- 슬러그: ${match.bestArticle.slug}`);
        console.log(`- URL: https://isatips.adbles.com/articles/${match.bestArticle.slug}`);
      } else {
        console.log(`⚠️ 관련 포스팅 부재 또는 점수 미달 (최고 점수: ${match.score}점)`);
        console.log(`- 사유: ${match.missingReason}`);
        if (match.recommendedNewTopic) {
          console.log(`\n💡 [추천 신규 포스팅 기획안]`);
          console.log(`- 추천 제목: ${match.recommendedNewTopic.title}`);
          console.log(`- 핵심 키워드: ${match.recommendedNewTopic.keyword}`);
          console.log(`- 카테고리: ${match.recommendedNewTopic.category}`);
        }
      }
      break;
    }

    case "write-post": {
      const rawQ = params.q || params.topic;
      if (!rawQ) {
        console.error("❌ --q '<질문 또는 주제>' 인자가 필요합니다.");
        process.exit(1);
      }
      const analysis = analyzeQuestion(rawQ);
      const postResult = generateAndSavePost(analysis, {
        title: params.title,
        keyword: params.keyword
      });

      console.log("\n✍️ [신규 포스팅 자동 발행 완료]");
      console.log(`- 제목: ${postResult.article.title}`);
      console.log(`- 슬러그: ${postResult.article.slug}`);
      console.log(`- 카테고리: ${postResult.article.categoryLabel}`);
      console.log(`- 배포 URL: ${postResult.canonicalUrl}`);
      console.log(`- 저장 위치: lib/kin-generated-articles.ts에 등록되었습니다.`);
      break;
    }

    case "answer": {
      const rawQ = params.q;
      const slug = params.slug;
      if (!rawQ || !slug) {
        console.error("❌ --q '<질문 내용>' 및 --slug '<아티클 슬러그>'가 필요합니다.");
        process.exit(1);
      }
      const analysis = analyzeQuestion(rawQ);
      const article = getArticle(slug);
      if (!article) {
        console.error(`❌ 슬러그 '${slug}'에 해당하는 아티클을 찾을 수 없습니다.`);
        process.exit(1);
      }

      const answer = generateKinAnswer(analysis, article);
      console.log("\n💬 [지식iN 맞춤형 답변 생성 결과]");
      console.log("--------------------------------------------------");
      console.log(answer.text);
      console.log("--------------------------------------------------");
      console.log(`- 글자수(링크 제외): ${answer.charCountWithoutLink}자`);
      console.log(`- 연결 링크: ${answer.articleUrl}`);
      break;
    }

    case "check": {
      const rawQ = params.q;
      const answerText = params.text || (params.file ? fs.readFileSync(params.file, "utf-8") : "");
      if (!rawQ || !answerText) {
        console.error("❌ --q '<질문>' 및 --text '<답변>' (또는 --file '<파일경로>')가 필요합니다.");
        process.exit(1);
      }
      const analysis = analyzeQuestion(rawQ);
      const checkRes = checkKinAnswer({
        analysis,
        answerText,
        questionUrl: params.url,
        articleSlug: params.slug || "manual-check"
      });

      console.log("\n🛡️ [지식iN 가드레일 검사 결과]");
      if (checkRes.passed) {
        console.log("✅ 모든 검사 통과! 등록 가능 초안입니다.");
      } else {
        console.log("❌ 검사 실패! 등록 불가 항목이 있습니다:");
        checkRes.errors.forEach(e => console.log(`  - 🛑 ${e}`));
      }
      if (checkRes.warnings.length > 0) {
        console.log("⚠️ 주의 사항:");
        checkRes.warnings.forEach(w => console.log(`  - ⚠️ ${w}`));
      }
      console.log(`\n- 검사 통계: 글자수 ${checkRes.stats.charCountWithoutLink}자 | 링크 ${checkRes.stats.linkCount}개 | 오늘 등록 ${checkRes.stats.todayAnswers}/${checkRes.stats.maxDailyCadence}건`);
      break;
    }

    case "record": {
      const url = params.url || "";
      const slug = params.slug || "";
      const rawQ = params.q || "";
      const answerText = params.text || (params.file ? fs.readFileSync(params.file, "utf-8") : "");

      if (!slug || !rawQ || !answerText) {
        console.error("❌ --slug, --q, --text (또는 --file) 인자가 필요합니다.");
        process.exit(1);
      }

      saveHistory({
        url,
        articleSlug: slug,
        question: rawQ,
        answer: answerText,
        createdAt: new Date().toISOString()
      });

      console.log("\n📝 [지식iN 답변 이력 기록 완료]");
      console.log(`- 슬러그: ${slug}`);
      console.log(`- 질문 URL: ${url || "미기재"}`);
      console.log(`- 현재 오늘 등록 건수: ${getTodayAnswerCount()}건`);
      break;
    }

    case "pipeline": {
      const rawQ = params.q;
      const questionUrl = params.url || "";
      const forceNew = params["force-new"] === "true";

      if (!rawQ) {
        console.error("❌ --q '<질문 내용>' 인자가 필요합니다.");
        process.exit(1);
      }

      console.log("==================================================");
      console.log("🚀 [네이버 지식iN 통합 파이프라인 가동]");
      console.log("==================================================");

      // 1. 질문 분석
      const analysis = analyzeQuestion(rawQ);
      console.log(`\n1️⃣ [질문 분석]`);
      console.log(`- 핵심 고민: ${analysis.coreProblem}`);
      console.log(`- 질문 조건: 층수(${analysis.floor || "없음"}), 엘베(${analysis.hasElevator === false ? "없음" : "있음"}), 규모(${analysis.loadSize || "없음"})`);

      // 2. 포스팅 매칭
      console.log(`\n2️⃣ [포스팅 매칭 검사]`);
      const match = matchArticle(analysis);
      let targetArticle;
      let isNewlyGenerated = false;

      if (!forceNew && match.hasMatch && match.bestArticle) {
        targetArticle = match.bestArticle;
        console.log(`✅ 기존 포스팅 매칭 성공! (점수: ${match.score}점)`);
        console.log(`- 제목: ${targetArticle.title}`);
        console.log(`- 링크: https://isatips.adbles.com/articles/${targetArticle.slug}`);
      } else {
        console.log(`⚠️ 질문에 딱 맞는 포스팅 부재 감지! 신규 포스팅 자동 생성을 시작합니다.`);
        const generated = generateAndSavePost(analysis, match.recommendedNewTopic);
        targetArticle = generated.article;
        isNewlyGenerated = true;
        console.log(`✨ [신규 포스팅 자동 발행 완료]`);
        console.log(`- 제목: ${targetArticle.title}`);
        console.log(`- 슬러그: ${targetArticle.slug}`);
        console.log(`- 링크: ${generated.canonicalUrl}`);
      }

      // 3. 답변 생성
      console.log(`\n3️⃣ [지식iN 맞춤형 답변 생성]`);
      const answer = generateKinAnswer(analysis, targetArticle);

      // 4. 가드레일 검사
      console.log(`\n4️⃣ [가드레일 검증]`);
      const checkRes = checkKinAnswer({
        analysis,
        answerText: answer.text,
        questionUrl,
        articleSlug: targetArticle.slug
      });

      if (!checkRes.passed) {
        console.log(`❌ 가드레일 통과 실패!`);
        checkRes.errors.forEach(e => console.log(`  - 🛑 ${e}`));
      } else {
        console.log(`✅ 9대 가드레일 검사 100% 통과!`);
      }

      // 5. 최종 리포트 출력 (휴먼 인 더 루프 승인 대기)
      console.log("\n==================================================");
      console.log("📋 [최종 검토 및 사람 승인 대기]");
      console.log("==================================================");
      console.log(`\n[답변 초안 복사용]`);
      console.log("--------------------------------------------------");
      console.log(answer.text);
      console.log("--------------------------------------------------");
      console.log(`\n[상태 요약]`);
      console.log(`- 포스팅 생성 여부: ${isNewlyGenerated ? "신규 자동 발행됨 (lib/kin-generated-articles.ts)" : "기존 글 활용"}`);
      console.log(`- 연결 포스팅 URL: ${answer.articleUrl}`);
      console.log(`- 본문 글자수(링크 제외): ${answer.charCountWithoutLink}자`);
      console.log(`- 오늘 누적 등록 카덴스: ${checkRes.stats.todayAnswers} / ${checkRes.stats.maxDailyCadence}건`);
      console.log("\n👉 사람이 답변 내용을 검토한 후, 지식iN 페이지에 등록하고 아래 명령으로 기록하세요:");
      console.log(`npm run kin -- record --url "${questionUrl}" --slug "${targetArticle.slug}" --q "${analysis.title.replace(/"/g, '\\"')}" --file <초안저장파일>`);
      break;
    }

    default: {
      console.log("\n📖 [Kin Agent 사용법]");
      console.log("  npm run kin -- status");
      console.log("  npm run kin -- match --q '<질문 내용>'");
      console.log("  npm run kin -- write-post --q '<질문 내용>'");
      console.log("  npm run kin -- answer --q '<질문 내용>' --slug '<슬러그>'");
      console.log("  npm run kin -- check --q '<질문 내용>' --text '<답변>'");
      console.log("  npm run kin -- record --url '<URL>' --slug '<슬러그>' --q '<질문>' --text '<답변>'");
      console.log("  npm run kin -- pipeline --q '<질문 내용>' [--url '<URL>']");
      break;
    }
  }
}

main().catch(err => {
  console.error("에이전트 실행 중 오류 발생:", err);
  process.exit(1);
});
