# 이사준비백서

이사 전 준비부터 입주 후 정착, 지역별 이사 정보, 수리·설치까지 다루는 정보형 웹사이트입니다.

- 운영 주소: <https://isatips.adbles.com>
- 실행 환경: Node.js 22, Vinext, React, Cloudflare Workers
- 콘텐츠 저장 방식: 데이터와 이미지를 저장소에서 함께 관리
- 서버 기능: 쿠팡 상품 조회 API

## 로컬 확인

```bash
cp .env.example .env.local
npm ci
npm run audit:migration
npm run lint
npm run build
```

실제 쿠팡 API 키는 `.env.local` 또는 배포 서비스의 암호화된 환경변수에만 입력합니다.

## 주요 폴더

- `app/`: 페이지, 사이트맵, robots.txt, API 경로
- `lib/`: 글, 지역 데이터, 내부링크, 제휴 설정
- `public/images/`: 배포에 필요한 이미지 원본
- `docs/`: 운영 원칙, SEO 점검, 이전 문서
- `scripts/`: SEO·이전 사전점검

## 백업과 이전

비공개 GitHub 저장소를 원본 저장소로 사용합니다. 새 호스팅으로 이전할 때는 [GitHub 백업 및 사이트 이전 가이드](docs/GITHUB_BACKUP_AND_MIGRATION.md)를 먼저 확인하세요.
