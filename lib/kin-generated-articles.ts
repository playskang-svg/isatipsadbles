import type { Article } from "./articles";

/**
 * 지식iN 답변 에이전트(Kin Agent)가 자동 생성 및 등록한 아티클 목록입니다.
 * 기존 수기 작성 아티클과 완전히 분리되어 관리되며, lib/articles.ts에서 함께 취합되어 서비스됩니다.
 */
export const kinGeneratedArticles: Article[] = [];
