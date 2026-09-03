# 데이터 및 배포 이전 명세

- 기준일: 2026-09-03
- 목표: ChatGPT Sites에 종속되지 않고 GitHub 원본만으로 사이트를 다시 빌드하고 배포

## 데이터 보관 현황

현재 외부 데이터베이스는 사용하지 않는다.

| 데이터 | 현재 위치 | 이전 방법 |
|---|---|---|
| 일반·서비스 콘텐츠 | `lib/articles.ts` 및 연결 모듈 | GitHub 전체 백업 |
| 지역 콘텐츠 | `lib/incheon-articles.ts`, `lib/cheonan-articles.ts`, `lib/gyeonggi-articles.ts` 등 | GitHub 전체 백업 |
| 수리·설치 콘텐츠 | `lib/door-repair-articles.ts`, `lib/home-repair-articles.ts`, `lib/repair-keyword-pages.ts`, `lib/repair-regional-pages.ts` | GitHub 전체 백업 |
| 내부링크·카테고리 | `lib/internal-links.ts`, `lib/categories.ts` | GitHub 전체 백업 |
| 제휴·CTA 설정 | `lib/services.ts`, `lib/shopping.ts` | GitHub 전체 백업 후 링크 표본 검사 |
| 이미지 | `public/images/` | GitHub 전체 백업 |
| 검색엔진 설정 | `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx` | GitHub 전체 백업 |
| 비밀키 | 현재 호스팅의 환경변수 | 새 호스팅에 암호화하여 재등록 |

즉, 지금 단계에는 SQL 덤프나 데이터베이스 내보내기 파일이 없다. 콘텐츠를 향후 Supabase, D1 또는 다른 CMS로 옮길 때는 현재 Article 구조를 기준 스키마로 변환하되, 기존 URL slug를 기본키처럼 보존해야 한다.

## 외부 배포 기준

현재 빌드는 Vinext가 Cloudflare Worker와 정적 자산을 함께 만든다.

```text
GitHub 비공개 저장소
  → GitHub Actions 검증
  → Vinext 빌드
  → Cloudflare Worker + Assets
  → isatips.adbles.com
```

외부 배포에 필요한 항목:

- Cloudflare 계정 ID
- 배포 권한이 제한된 Cloudflare API 토큰
- `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY` Worker secret
- `NEXT_PUBLIC_SITE_URL=https://isatips.adbles.com`
- `isatips.adbles.com` DNS 관리 권한

## GitHub Secrets 이름

비공개 GitHub 저장소의 Actions secrets에 아래 이름만 등록한다.

| GitHub Secret | 설명 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | 해당 Worker 배포만 가능한 토큰 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID |

쿠팡 키는 GitHub Actions에 중복 보관하지 않고 Cloudflare Worker의 encrypted secret으로 직접 등록하는 방식을 우선한다.

## 최초 외부 배포 순서

1. 새 Cloudflare 계정에 Worker 이름 `moving-guide-korea` 사용 가능 여부를 확인한다.
2. Cloudflare Worker secrets에 `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`를 등록한다.
3. GitHub Actions secrets에 Cloudflare 배포 토큰과 계정 ID를 등록한다.
4. GitHub Actions에서 `Deploy external Cloudflare Worker`를 수동 실행한다.
5. 생성된 `workers.dev` 주소로 페이지와 쿠팡 상품 영역을 확인한다.
6. `isatips.adbles.com`을 새 Worker의 Custom Domain으로 연결한다.
7. DNS 전환 후 sitemap, robots, canonical과 대표 URL을 확인한다.
8. 문제가 없을 때까지 기존 Sites 연결은 롤백용으로 유지한다.

## 데이터베이스를 나중에 도입할 경우

DB 도입은 호스팅 이전과 분리한다. 호스팅과 데이터 구조를 동시에 바꾸면 오류 원인을 찾기 어렵다.

DB 전환 시 반드시 보존할 필드:

- `slug`
- `title`, `description`, `keyword`
- `category`, `categoryLabel`
- `publishedAt`, `updatedAt`
- `intro`, `sections`, `faq`
- `heroImage`, 본문 이미지와 alt
- `breadcrumbs`, `regionTree`
- `source`, `affiliateNotice`

전환 전후로 전체 slug 개수, 중복 slug, 누락 이미지, 내부링크와 sitemap URL을 비교한다.

## 배포 독립성 완료 조건

- [ ] GitHub 비공개 저장소에 소스·콘텐츠·이미지 전체 존재
- [ ] 실제 비밀키가 GitHub에 없음
- [ ] GitHub Actions에서 lint와 build 통과
- [ ] 외부 Cloudflare Worker 임시 주소 정상
- [ ] 쿠팡 API 환경변수 재등록 및 상품 영역 정상
- [ ] 운영 도메인 연결 전 대표 URL 비교 완료
- [ ] DNS 롤백 대상 기록
