# Project Status (2025.12.03)

## ✅ 오늘 한 작업 (Today's Work Log)
- **스크롤리텔링(Scrollytelling) 구현:**
    - Hero 섹션에서 스크롤 시 잉크가 퍼지며 Projects 섹션으로 전환되는 인터랙션 구현.
    - `GSAP ScrollTrigger` + `Sticky` 포지셔닝 적용.
- **잉크 트랜지션 최적화 (Critical Fixes):**
    - **Blob Preloading + Decoding:** 이미지 데이터를 메모리에 미리 로드하고 디코딩하여, 첫 실행 시 발생하는 깜빡임(Flickering) 및 흰색 플래시 현상 완전 제거.
    - **Direct URL Masking:** 캔버스/SVG 오버헤드 없이 CSS Mask에 이미지 URL을 직접 적용하여 렌더링 성능 극대화.
- **디자인 디테일 수정:**
    - **검정 테두리(Ink Border):** 마스크 스케일링(Hero 105% vs Border 100%) 기법을 사용하여, 성능 저하 없이 선명한 검정 테두리 구현.
    - **좌우 반전:** 잉크가 퍼지는 방향을 반대로 변경 (`scaleX(-1)`).
    - **레이아웃 조정:** 전체 스크롤 길이 축소 (300vh -> 150vh) 및 하단 Footer 제거.

## 🚀 해야 할 일 (To-Do)
- **추가 최적화:** 저사양 기기에서의 퍼포먼스 테스트 및 메모리 사용량 점검.
- **디자인 일관성 검증:** Hero와 Projects 간의 폰트, 여백 등 미세한 디자인 통일성 확인.
- **모바일 대응:** 반응형 레이아웃 확인 및 수정.
