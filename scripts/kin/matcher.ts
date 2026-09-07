import { articles, type Article } from "../../lib/articles";
import type { QuestionAnalysis } from "./analyzer";

export interface MatchResult {
  hasMatch: boolean;
  score: number;
  bestArticle?: Article;
  candidates: { article: Article; score: number; reason: string }[];
  missingReason?: string;
  recommendedNewTopic?: {
    keyword: string;
    title: string;
    category: "planning" | "quotes" | "admin" | "home-care" | "repair-install" | "regional";
  };
}

export function matchArticle(analysis: QuestionAnalysis): MatchResult {
  const queryWords = [
    ...analysis.keywords,
    analysis.floor,
    analysis.region,
    ...analysis.targetItems
  ].filter(Boolean).map(s => s!.toLowerCase());

  const scoredArticles = articles.map(article => {
    let score = 0;
    const reasons: string[] = [];

    const artTitle = article.title.toLowerCase();
    const artKeyword = article.keyword.toLowerCase();
    const artDesc = article.description.toLowerCase();
    const artSec = (article.secondaryKeywords || []).map(k => k.toLowerCase()).join(" ");

    // 1. 키워드 정확 일치
    for (const kw of queryWords) {
      if (artKeyword.includes(kw) || kw.includes(artKeyword)) {
        score += 35;
        reasons.push(`핵심키워드 일치(${kw})`);
      } else if (artTitle.includes(kw)) {
        score += 20;
        reasons.push(`제목 포함(${kw})`);
      } else if (artDesc.includes(kw) || artSec.includes(kw)) {
        score += 10;
        reasons.push(`설명/서브키워드 포함(${kw})`);
      }
    }

    // 2. 지역 일치 가산점
    if (analysis.region) {
      if (artTitle.includes(analysis.region.toLowerCase()) || artKeyword.includes(analysis.region.toLowerCase())) {
        score += 25;
        reasons.push(`지역 일치(${analysis.region})`);
      }
    }

    // 3. 특수 조건 가산점
    if (analysis.loadSize && (artTitle.includes("원룸") || artTitle.includes("1톤") || artTitle.includes("포장이사"))) {
      score += 15;
      reasons.push(`이사규모 매칭`);
    }

    if (analysis.isCostQuestion && (artTitle.includes("비용") || artTitle.includes("견적") || artKeyword.includes("비용"))) {
      score += 15;
      reasons.push(`비용/견적 의도 일치`);
    }

    // 4. 특정 품목/서비스 필수 검증
    if (analysis.targetItems.length > 0) {
      const coversTargetItem = analysis.targetItems.some(item => {
        const itemWords = item.split("/");
        return itemWords.some(w => artTitle.includes(w) || artKeyword.includes(w) || artDesc.includes(w));
      });
      if (!coversTargetItem) {
        score = 0; // 해당 특수 품목을 다루지 않으면 기존 일반 글 매칭 배제
      } else {
        score += 30;
        reasons.push(`특수품목(${analysis.targetItems.join(",")}) 일치`);
      }
    }

    return {
      article,
      score,
      reason: reasons.slice(0, 3).join(", ")
    };
  });

  scoredArticles.sort((a, b) => b.score - a.score);

  const topMatches = scoredArticles.slice(0, 3).filter(m => m.score > 0);
  const best = topMatches[0];

  // 매칭 임계치: 최소 60점 이상이어야 질문을 정확히 다루는 기존 포스트로 간주
  const MATCH_THRESHOLD = 60;
  const hasMatch = Boolean(best && best.score >= MATCH_THRESHOLD);

  let recommendedNewTopic;
  if (!hasMatch) {
    const mainKw = analysis.keywords.join(" ") || "이사 비용 절약";
    let cat: "planning" | "quotes" | "admin" | "home-care" | "repair-install" | "regional" = "quotes";
    if (analysis.targetItems.some(i => ["도어락/방화문", "싱크대/수전", "식기세척기"].includes(i))) {
      cat = "repair-install";
    } else if (analysis.targetItems.includes("입주청소")) {
      cat = "home-care";
    } else if (analysis.region) {
      cat = "regional";
    }

    recommendedNewTopic = {
      keyword: mainKw,
      title: `${mainKw} 가이드: ${analysis.coreProblem} 핵심 해결법`,
      category: cat
    };
  }

  return {
    hasMatch,
    score: best ? best.score : 0,
    bestArticle: hasMatch ? best.article : undefined,
    candidates: topMatches,
    missingReason: hasMatch ? undefined : `질문자의 핵심 조건(${analysis.coreProblem})을 정확하게 설명하는 특화 포스팅이 부족합니다.`,
    recommendedNewTopic
  };
}
