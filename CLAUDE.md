# 이사준비백서 — Claude 작업 규칙

Antigravity/Codex용 `AGENTS.md`와 같은 기준을 Claude에도 적용한다. 두 파일이 어긋나면 `docs/ISATIPS_AI_MASTER_OPERATING_INSTRUCTION_v1.0.md`가 최종 기준이다.

## 1. 최상위 운영 기준

콘텐츠 생성·수정, SEO, 내부링크, 카테고리 구성, 수익화 작업을 시작하기 전에 `docs/ISATIPS_AI_MASTER_OPERATING_INSTRUCTION_v1.0.md`를 처음부터 끝까지 읽는다. 개별 지시와 충돌하지 않는 한 이 원칙을 유지하며, 임의로 축소하거나 완화하지 않는다.

핵심만 옮기면 이렇다.

- 페이지 수를 늘리는 것은 목표가 아니다. 검색 방문자의 실제 문제를 해결한다.
- 신규 작성 전에 기존 콘텐츠와 검색 의도가 겹치는지 먼저 본다. 겹치면 기존 글을 강화한다.
- 지역명이나 유사 키워드만 바꾼 기계적 대량 생성을 금지한다.
- 가격·정책·법률·절차·통계·업체 정보·제휴 조건은 추측하지 않는다. 확인한 것만 쓰고, 확인일과 출처를 남긴다. 고정되지 않은 금액은 단정하지 않는다.
- 내부링크와 수익화 요소는 "이 페이지를 읽은 사람이 다음에 무엇을 궁금해할까"를 기준으로 배치한다. 한 소제목에 제휴링크는 최대 1개.
- 제휴 여부 때문에 평가를 왜곡하지 않는다.
- §20의 최종 판단 질문 5개에 모두 명확히 YES가 아니면 발행하지 말고 검토 대상으로 보고한다.

## 2. 발행 전 체크

기준 문서 §15의 자체검수 항목을 통과해야 발행한다. 특히 다음 셋은 매번 확인한다.

- 첫 화면에서 핵심 답이 보이는가
- 추측한 수치가 섞이지 않았는가
- 기존 페이지와 검색 의도가 중복되지 않는가

## 3. 검증 순서

```
npm run lint            # tsc --noEmit
npm run audit:migration
npm run build
npm run start           # 127.0.0.1:3000
npm run audit:seo       # 위 서버가 떠 있어야 동작
```

`scripts/seo-audit.mjs`의 점검 대상은 하드코딩이다. 새 글이나 새 카테고리를 추가하면 이 파일도 함께 갱신한다.

## 4. 콘텐츠·링크 구조

- 글 본문: `lib/articles.ts` 및 주제별 `lib/*-articles.ts`
- 내부링크: `lib/internal-links.ts`
- 제휴링크: 절대 URL을 하드코딩하지 않는다. `~/dev/A-factory/affiliate-links.json`이 단일 소스이고 `npm run sync:affiliate`가 `data/affiliate-links.json`으로 복사한다. 코드는 `link_key`로만 조회한다.
- 키워드→링크 매칭 규칙은 `lib/affiliate-match.ts` 한 곳에 모은다. 생성형 페이지를 개별로 고치지 않는다. 이름이 정해진 단독 글만 `lib/services.ts`의 `serviceByArticle`에 직접 적는다.
- 링크를 폐기할 때는 JSON에서 지우지 말고 `status: "retired"`와 사유를 남긴다. 참조가 남아 있으면 빌드가 깨진다.

## 5. 색인

- `public/<key>.txt`가 IndexNow 키 파일이다. 파일명과 내용이 같아야 하고, 지우거나 이름을 바꾸면 제출이 전량 거절된다.
- `npm run indexnow`가 사이트맵 lastmod 기준으로 최근 변경 URL만 제출한다. 전체 재제출(`--all`)은 상시 사용하지 않는다.
- 배포 워크플로가 `wrangler deploy` 후 자동 제출한다. 구글은 IndexNow 미참여이므로 빙·네이버·얀덱스 계열에만 반영된다.

## 6. 배포

`main`에 푸시하면 GitHub Actions가 lint → build → Cloudflare Workers 배포 → IndexNow 제출까지 진행한다.

Cowork 세션(클라우드 컨테이너)에서는 GitHub 자격증명이 없어 푸시가 되지 않는다. 커밋까지 만들어두고 사용자가 로컬 터미널에서 `git push origin main`을 실행한다.

## 7. 로컬 작업 시 주의

- 연결 폴더에서 빌드가 `EPERM ... unlink dist/...`로 실패하면 세션의 파일 삭제 권한이 없는 것이다. 권한을 받은 뒤 `rm -rf dist`하고 다시 빌드한다.
- 여러 세션이 같은 저장소를 동시에 만질 수 있다. 커밋 전에 `git status`로 내가 만들지 않은 변경이 섞여 있는지 확인하고, 남의 작업은 별도 커밋으로 분리한다.
- `.git/index.lock`이나 `HEAD.lock`이 남아 커밋이 막히면 파일 시각을 먼저 확인한다. 방금 것이면 기다리고, 오래된 0바이트 잔여물이면 지운다.
