# Tripick landing page

사용자 제공 브랜드 심볼, 최종 기획안, 서비스 플로우차트를 바탕으로 만든 한국어 반응형 랜딩페이지입니다.

## 실행

`dist` 폴더를 정적 웹 서버로 제공하면 됩니다. 예: `python -m http.server 4317 --directory dist`

별도 설치나 빌드 과정은 없습니다. 실행 후 http://localhost:4317 에 접속하세요.

배포된 사이트: https://tripick-gift-journey.gaemaddorri.chatgpt.site

## 주요 파일

- `dist/index.html`: 페이지 내용과 섹션 구성
- `dist/styles.css`, `dist/sections.css`, `dist/showcase.css`: 기본 디자인과 서비스 소개 화면
- `dist/presentation.css`, `dist/hero-shop.css`: 발표용 섹션 크기, 웰컴 배경과 AR 카드, 마지막 아이콘 반사
- `dist/finder.css`, `dist/finder.js`: 국가·대상·취향·예산 선택 및 추천 상품 UI
- `dist/recommendation-engine.js`: 상품 필터와 추천 정렬
- `dist/catalog.js`: 한국 9개·일본 27개·대만 6개·프랑스 6개, 총 48개 상품 데이터
- `dist/assets/`: 로고, 서비스 시연 이미지, 실제 상품 사진
- `product-sources.json`, `country-product-sources.md`, `hero-photo-source.md`: 상품 및 사진 출처

## 추천 로직 검증

Node.js가 설치된 환경에서 프로젝트 루트에서 실행합니다.

```sh
node check-recommendations.cjs
```

국가·대상·취향·예산 조합 300개, 필터 경계, 빈 결과, 가격 환산 및 로컬 이미지 존재 여부를 확인합니다.

## 구현 범위

- 브랜드 컬러와 제공 심볼을 적용한 반응형 화면
- 스크롤 진입 효과, 실제 기념품 숍 배경의 AR 정보 카드, 여정 진행선
- 빠른 추천 / 대상별 추천 전환, 국가·취향·대상·예산에 따른 실제 상품 카탈로그 필터링
- 상품 사진과 추천 이유, 판매처 링크, 통화별 가격 표시
- 앵커 메뉴, FAQ, 키보드 탭 전환, reduced-motion 대응
- 실제 AI, AR, 상품 재고, 결제, 배송 API 연동은 포함되지 않습니다.
- 해외배송과 카드 인쇄·동봉은 원문대로 제휴 조건부 확장 기능으로 표시합니다.

사진 출처와 사용권 정보는 출처 파일들과 페이지 하단에 있습니다. 브랜드 심볼은 사용자 제공 이미지의 투명 배경 버전입니다. 제품 사진과 브랜드 자산의 권리는 각 권리자에게 있으며, 이 저장소 공개가 별도의 재사용 라이선스를 부여하지 않습니다.

## 배포와 팀 작업

이 저장소는 팀 소스 공유용입니다. GitHub에 push하는 것만으로 기존 Sites 공개 페이지가 자동 갱신되지는 않습니다. `.openai/hosting.json`은 기존 Sites 프로젝트 연결 정보이며 비밀 키를 포함하지 않습니다. 다른 서비스에 배포하려면 정적 파일 디렉터리를 `dist`로 지정하세요.
