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

## 5. 쿠팡 API 시크릿

`app/api/coupang-products`는 서버에서 HMAC 서명을 만들어 쿠팡 파트너스 검색 API를 호출한다. **Cloudflare Workers는 런타임에 `.env`를 읽지 않는다.** 로컬 `.env`에 키가 있어도 배포된 사이트에서는 인증이 실패한다. 키는 `wrangler secret`으로 따로 등록해야 한다.

```bash
npx wrangler secret list                      # 등록된 이름만 표시(값은 안 보임)
npx wrangler secret put COUPANG_ACCESS_KEY
npx wrangler secret put COUPANG_SECRET_KEY
```

원본 키는 `~/dev/A-factory/affiliate-links.json`의 `coupang` 블록에 있다. 그 파일의 `locations` 항목에 등록 현황을 적어둔다. 시크릿 키는 브라우저·정적 HTML·커밋 어디에도 넣지 않는다.

설정 여부는 값 노출 없이 확인할 수 있다.

```bash
curl -s "https://isatips.adbles.com/api/coupang-products?diag=1"
# {"credentialsConfigured":true}
```

키가 없으면 라우트는 502가 아니라 200에 `degraded: "credentials_missing"`을 실어 보내고, 프런트는 제휴 문구를 감춘 채 준비물 목록만 보여준다. 링크가 없는데 수수료 고지만 남는 상황을 막기 위해서다.

## 6. 색인

- `public/<key>.txt`가 IndexNow 키 파일이다. 파일명과 내용이 같아야 하고, 지우거나 이름을 바꾸면 제출이 전량 거절된다.
- `npm run indexnow`가 사이트맵 lastmod 기준으로 최근 변경 URL만 제출한다. 전체 재제출(`--all`)은 상시 사용하지 않는다.
- 배포 워크플로가 `wrangler deploy` 후 자동 제출한다. 구글은 IndexNow 미참여이므로 빙·네이버·얀덱스 계열에만 반영된다.

## 7. 배포 — 작업과 실행의 분담

**작성은 Cowork(Claude 대화), 실행은 맥(Antigravity / Claude Code).** 2026-09-05에 정한 방식이다.

Cowork 세션은 맥 안에 격리된 리눅스 샌드박스에서 돌아 키체인이 보이지 않는다. git 자격증명도 wrangler 로그인도 없다. 반면 Antigravity와 맥의 Claude Code는 사용자 계정으로 실행되어 둘 다 그대로 쓴다.

### Cowork 쪽 규칙

- 파일만 고치고 **커밋하지 않는다.** git 쓰기 작업을 하면 삭제 권한이 만료됐을 때 `.git/index.lock`이 남아 맥 쪽 커밋을 막는다.
- 읽기용 git 호출은 반드시 `git --no-optional-locks ...`를 쓴다. 그냥 `git status`는 인덱스를 갱신하며 락을 만든다.
- `npm ci`와 `npm run build`를 돌리지 않는다(8장 참조).
- 작업을 마치면 **인계문을 만들어 넘긴다.** 성격에 따라 둘 중 하나 또는 둘 다다.

**안티그래비티 인계문 — 실행(커밋·푸시·배포·시크릿)**

실행 명령은 코드블록 하나에 명령만 담는다. 설명 문장을 코드블록에 섞지 않는다. 사용자가 설명까지 통째로 붙여넣어 셸 오류가 난 적이 있다.

1. 무엇을 바꿨는지 (한두 문장)
2. 변경 파일 목록
3. 실행 명령 — 커밋 메시지 초안까지 `-m`에 넣어둔다
4. 확인 방법 — 배포 후 무엇이 어떻게 나와야 정상인지

**Claude Code 인계문 — 코드 작업 + 배포**

Cowork에서 손대기 어려운 코드 작업(빌드를 돌려봐야 아는 변경, 실제 외부 API 응답 확인, 여러 파일에 걸친 리팩터링)은 여기서 설계만 하고 구현을 넘긴다. **Claude Code도 자격증명이 있으므로 배포와 라이브 확인까지 지시에 포함한다.** 구현만 시키고 배포를 따로 떼면 왕복이 한 번 더 생긴다. 명령이 아니라 자연어 지시문으로 쓴다.

1. `CLAUDE.md`를 먼저 읽으라는 지시
2. 목표 — 무엇을 달성해야 하는지
3. 손댈 파일과 이유
4. 제약 — 지켜야 할 기존 구조, 건드리면 안 되는 것
5. 배포 — `npm run ship -- -m "커밋 메시지 초안"`까지 실행하도록 명시
6. 완료 기준 — 배포 후 **라이브에서** 무엇이 어떻게 보여야 끝인지

두 인계문을 모두 낼 때는 어느 쪽이 선행인지 밝힌다. 자격증명 등록처럼 코드 작업의 전제가 되는 일은 안티그래비티 쪽을 먼저 처리한다.

### 맥 쪽 실행

```bash
npm run ship -- -m "커밋 메시지"
```

검증 → 커밋 → 푸시 → 배포 확인까지 한 번에 돈다. `main` 푸시가 GitHub Actions를 통해 lint → build → Cloudflare Workers 배포 → IndexNow 제출로 이어진다.

`wrangler secret put` 같은 자격증명 작업도 전부 이쪽이다.

## 8. node_modules는 맥 소유

맥과 Cowork 리눅스 샌드박스가 같은 `node_modules` 폴더를 공유한다. rolldown 같은 네이티브 바인딩은 `npm ci`를 돌린 쪽 플랫폼 것만 설치되므로 **양쪽에서 빌드할 수 없다.** 반대쪽에서는 `Cannot find native binding` 에러가 난다.

배포를 실행하는 맥 쪽을 소유자로 둔다. Cowork 세션에서는 `npm ci`와 `npm run build`를 돌리지 않는다. 여기서 가능한 검증은 `npm run lint`(tsc는 순수 JS라 플랫폼 무관)와 `npm run audit:migration`까지이고, 빌드와 SEO 감사는 GitHub Actions에 맡긴다.

`npm run ship`이 사전점검에서 이 불일치를 감지해 멈춘다.

## 9. 로컬 작업 시 주의

- 연결 폴더에서 빌드가 `EPERM ... unlink dist/...`로 실패하면 세션의 파일 삭제 권한이 없는 것이다. 권한을 받은 뒤 `rm -rf dist`하고 다시 빌드한다.
- 여러 세션이 같은 저장소를 동시에 만질 수 있다. 커밋 전에 `git status`로 내가 만들지 않은 변경이 섞여 있는지 확인하고, 남의 작업은 별도 커밋으로 분리한다.
- `.git/index.lock`이나 `HEAD.lock`이 남아 커밋이 막히면 파일 시각을 먼저 확인한다. 방금 것이면 기다리고, 오래된 0바이트 잔여물이면 지운다.
