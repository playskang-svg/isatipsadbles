# 이사준비백서 GitHub 백업 및 사이트 이전 가이드

- 기준일: 2026-09-03
- 운영 도메인: `https://isatips.adbles.com`
- 목적: 현재 검색 URL과 수익화 기능을 보존하면서 호스팅만 안전하게 이전

## 1. 백업 원칙

비공개 GitHub 저장소를 코드와 콘텐츠의 기준 원본으로 사용한다.

GitHub에 포함할 항목:

- 모든 페이지와 콘텐츠 데이터
- 이미지 원본
- 내부링크·제휴링크 설정
- sitemap·robots·canonical 생성 코드
- 운영 및 SEO 문서
- 빌드 잠금 파일 `package-lock.json`

GitHub에 포함하지 않을 항목:

- 쿠팡 Access Key와 Secret Key
- `.env`, `.env.local` 등 실제 환경변수 파일
- 배포 서비스 로그인 정보와 토큰
- `node_modules`, `.next`, `dist` 등 재생성 가능한 빌드 결과

## 2. 현재 구조에서 중요한 점

이 사이트는 순수 정적 사이트가 아니다. `/api/coupang-products`에서 서버 측 환경변수로 쿠팡 API를 호출한다. 따라서 서버 기능이 없는 GitHub Pages로 그대로 옮기면 상품 조회 기능이 작동하지 않는다.

가장 적은 변경으로 이전하려면 GitHub 비공개 저장소를 소스 원본으로 두고 Cloudflare Workers 계열 호스팅에 연결한다. 다른 Node.js 호스팅으로 옮길 때는 Vinext/Cloudflare 빌드 호환 여부를 먼저 확인한다.

현재 별도 데이터베이스는 없다. 게시글, 지역 정보, 내부링크, 제휴 설정은 `lib/*.ts`에 있고 이미지는 `public/images/`에 있다. 따라서 GitHub 전체 백업이 현재 데이터 백업이기도 하다. 자세한 목록은 [데이터 및 배포 이전 명세](DATA_AND_DEPLOYMENT_MIGRATION.md)를 따른다.

## 3. GitHub 백업 절차

1. GitHub에서 비공개 저장소 `moving-guide-korea`를 만든다.
2. README, `.gitignore`, 라이선스를 자동 생성하지 않고 빈 저장소로 만든다.
3. 현재 프로젝트에 해당 저장소를 `github` 원격 저장소로 추가한다.
4. 준비 브랜치를 먼저 올리고 검수 후 `main`을 올린다.
5. GitHub의 기본 브랜치 보호 규칙에서 PR 검수를 권장한다.
6. GitHub Actions의 `Verify site backup`이 통과하는지 확인한다.
7. 새 Cloudflare 계정 준비가 끝나면 `Deploy external Cloudflare Worker`를 수동 실행한다.

권장 원격 저장소 이름:

```text
origin  = 현재 ChatGPT Sites 원본 저장소
github  = 새 비공개 GitHub 백업 저장소
```

이렇게 분리하면 새 호스팅 검증이 끝날 때까지 현재 운영 사이트를 그대로 유지할 수 있다.

## 4. 새 호스팅에 필요한 환경변수

| 이름 | 공개 여부 | 용도 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 공개 | canonical·sitemap 기준 주소. `https://isatips.adbles.com` 유지 |
| `COUPANG_ACCESS_KEY` | 비밀 | 쿠팡 상품 API 인증 |
| `COUPANG_SECRET_KEY` | 비밀 | 쿠팡 상품 API 서명 |

키 값은 GitHub 코드에 넣지 않는다. 새 호스팅의 암호화된 환경변수 설정에 직접 등록한다. 과거 대화나 외부 문서에 노출된 키는 이전 전에 재발급하는 편이 안전하다.

## 5. 이전 순서

1. GitHub 비공개 저장소 백업을 완료한다.
2. 새 호스팅에 GitHub 저장소를 연결한다.
3. 임시 주소에서 `npm ci`, `npm run lint`, `npm run build`를 통과시킨다.
4. 환경변수 3개를 등록하고 쿠팡 상품 조회 기능을 확인한다.
5. 대표 페이지, 카테고리, sitemap, robots, 이미지와 제휴링크를 확인한다.
6. 기존과 동일한 경로가 모두 HTTP 200인지 비교한다.
7. 새 호스팅에 `isatips.adbles.com`을 연결한다.
8. DNS를 전환하되 기존 Sites 배포와 도메인 연결은 바로 삭제하지 않는다.
9. 운영 도메인에서 canonical, sitemap, robots, 구조화 데이터를 다시 확인한다.
10. 안정화 확인 후에만 기존 호스팅 연결을 정리한다.

## 6. SEO 보존 기준

호스팅만 바꾸고 `isatips.adbles.com`과 기존 URL 경로를 유지하면 검색엔진에는 사이트 주소 이전이 아니라 서버 이전에 가깝다.

- 모든 기존 URL을 그대로 유지한다.
- canonical은 계속 `https://isatips.adbles.com/...`을 가리킨다.
- `https://isatips.adbles.com/sitemap.xml`을 유지한다.
- `robots.txt`와 네이버 사이트 인증 메타를 보존한다.
- 없어진 URL이 생기면 가장 가까운 관련 글로 301 리디렉션한다.
- 새 호스팅 전환 직후 404, 5xx, 이미지 오류를 전수 점검한다.
- 도메인이 같다면 Google Search Console의 주소 변경 도구는 사용하지 않는다.

## 7. 수익구조 보존 기준

- 기존 CPA/CPS/Affiliate URL을 임의로 바꾸지 않는다.
- 쿠팡 API 키는 새 호스팅에서만 다시 설정한다.
- 상단 빠른견적 링크, 본문 제휴링크, 광고 고지를 표본 검사한다.
- 외부 링크의 `rel` 속성과 추적 파라미터가 사라지지 않았는지 확인한다.

## 8. 전환 직전 검사 URL

- `/`
- `/category/repair-install`
- `/category/regional`
- `/articles/repair-keyword-001-door-hole`
- `/articles/incheon-moving-regional-guide`
- `/sitemap.xml`
- `/info/sitemap-info.xml`
- `/robots.txt`
- `/api/coupang-products` 관련 상품 영역

## 9. 롤백 원칙

새 호스팅에 문제가 생기면 DNS를 기존 Sites 대상으로 되돌린다. 따라서 다음이 확인되기 전에는 기존 사이트나 도메인 연결을 삭제하지 않는다.

- 대표 URL과 sitemap 정상 응답
- 쿠팡 API 및 제휴링크 정상 작동
- 모바일 화면 정상 표시
- 404/500 급증 없음
- Google/Naver 수집 오류 없음

## 10. 완료 판정

- [ ] 비공개 GitHub에 전체 이력이 백업됨
- [ ] GitHub Actions 검증 통과
- [ ] 새 호스팅 환경변수 등록
- [ ] 새 호스팅 임시 주소 검증
- [ ] 운영 도메인 DNS 전환
- [ ] canonical·sitemap·robots 정상
- [ ] 제휴링크·쿠팡 상품 조회 정상
- [ ] 기존 호스팅 롤백 경로 유지
