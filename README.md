<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Something Web - Portfolio Project

이 프로젝트는 모션 그래픽 디자이너의 포트폴리오 웹사이트입니다.
추상적인 개념을 시각적 언어로 번역한다는 철학을 바탕으로, 잉크 번짐, 스크롤 인터랙션 등 감각적인 웹 경험을 제공합니다.

---

## 📅 2025.12.02 작업 로그 (Work Log)

### ✅ 완료된 작업 (Completed)

1.  **상세 페이지 (Project Detail) 디자인 구현**
    *   **Concept**: '연구 노트(Research Note)' 컨셉의 디자인을 적용했습니다.
    *   **Visual Elements**: 줄 노트 배경, 붉은색 마진 라인, 손글씨 스타일의 타이틀, 테이프로 붙인 듯한 이미지 효과 등을 구현하여 아날로그적인 감성을 더했습니다.
    *   **Navigation**: 뒤로 가기(Back to Collection) 기능을 추가하여 사용자 편의성을 높였습니다.

2.  **전역 내비게이션 (Global Navigation) 개선**
    *   **Scroll Visibility**: 메인 페이지에서 스크롤 시 우측 상단에 'INDEX' 버튼이 나타나도록 하여, 인트로 영상 몰입도를 해치지 않으면서도 접근성을 확보했습니다.
    *   **Menu Overlay**: 'INDEX' 버튼 클릭 시 나타나는 풀스크린 메뉴 오버레이를 구현했습니다.
        *   Framer Motion을 활용한 부드러운 등장/퇴장 애니메이션.
        *   Home, Work, Profile 등 주요 섹션으로의 이동 기능 제공.

3.  **로딩 애니메이션 교체 (Loading Animation Replacement)**
    *   **Concept**: 기존의 회전하는 스피너를 '책이 넘어가는' 애니메이션으로 교체하여 사이트의 아이덴티티를 강화했습니다.
    *   **Implementation**: `BookLoader` 컴포넌트를 새로 제작하고, Framer Motion의 `rotateY`를 활용하여 3D 페이지 넘김 효과를 구현했습니다.
    *   **Refinement**: 단순 회전이 아닌, 실제 책장이 넘어가는 듯한 입체적인 움직임으로 디테일을 높였습니다.

---

## 📅 2025.11.29 작업 로그 (Work Log)

### ✅ 완료된 작업 (Completed)

1.  **잉크 번짐 효과 (Ink Bleed Effect) 구현**
    *   **WebGL Shader**: 기존의 단순 확대/축소 애니메이션을 WebGL 쉐이더 기반의 '잉크 번짐' 효과로 고도화했습니다.
    *   **Natural Spread**: 클릭 시 잉크가 종이에 스며들듯 화면 전체로 자연스럽게 퍼져나가며 이미지를 드러냅니다.
    *   **Stability**: 화면 흔들림(Zoom) 없이 잉크의 밀도(Density)가 높아지는 방식을 채택하여 시각적 어지러움을 방지했습니다.

2.  **프로젝트 모달(Modal) 연동**
    *   **Seamless Flow**: `ProjectReveal` 컴포넌트 클릭 시 페이지 이동 대신, 'Works' 페이지와 동일한 **상세 모달**이 뜨도록 변경했습니다.
    *   **Timing**: 잉크 애니메이션이 화면을 가득 채운 종료 시점에 맞춰 모달이 자연스럽게 오픈됩니다.

3.  **애니메이션 재실행 및 초기화 로직**
    *   **Reset Logic**: 모달을 닫으면 잉크 상태가 자동으로 초기화되어, 사용자가 다시 클릭했을 때 애니메이션이 정상적으로 재실행됩니다.

4.  **컨텐츠 연결**
    *   **Data Binding**: 우측 텍스트 영역에 실제 프로젝트 데이터(Title, Description)를 연동하여 정보를 표시했습니다.

---

## 🚀 향후 계획 (To-Do)

1.  **세부 페이지(Project Detail) 컨텐츠 고도화**
    *   현재 디자인 템플릿에 맞춰 각 프로젝트별 실제 데이터(이미지, 텍스트)를 바인딩해야 합니다.
    *   다양한 미디어 타입(비디오, 슬라이더 등) 지원 추가 고려.

2.  **모바일 반응형 최적화**
    *   모바일 환경에서도 잉크 효과와 모달 인터랙션이 매끄럽게 작동하도록 최적화가 필요합니다.
    *   상세 페이지의 레이아웃이 모바일 화면에 맞게 조정되어야 합니다.

3.  **성능 최적화**
    *   이미지 프레임 시퀀스 로딩 속도 개선 및 메모리 관리.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## 🛠️ 기술 스택 및 의존성 (Tech Stack & Dependencies)

이 프로젝트는 다음의 주요 기술과 라이브러리를 사용하여 구축되었습니다.

### Core
*   **React** (`^19.2.0`): 사용자 인터페이스 구축을 위한 JavaScript 라이브러리.
*   **TypeScript** (`~5.8.2`): 정적 타입을 지원하는 JavaScript의 상위 집합.
*   **Vite** (`^6.2.0`): 빠르고 가벼운 프론트엔드 빌드 도구.

### Styling & Animation
*   **Tailwind CSS** (`^3.4.17`): 유틸리티 퍼스트 CSS 프레임워크.
*   **Framer Motion** (`^12.23.24`): React용 프로덕션 레디 모션 라이브러리.
*   **GSAP** (`^3.13.0`): 고성능 웹 애니메이션 라이브러리 (ScrollTrigger 포함).
*   **Lenis** (`^1.3.15`): 부드러운 스크롤 경험을 위한 라이브러리.

### Routing & Icons
*   **React Router DOM** (`^6.22.3`): React 애플리케이션을 위한 선언적 라우팅.
*   **Lucide React** (`^0.554.0`): 일관된 디자인의 아름다운 아이콘 세트.

### AI & Utilities
*   **@google/genai** (`^1.30.0`): Google Gemini AI 모델 연동을 위한 SDK.
*   **React Markdown** (`^10.1.0`): Markdown 컨텐츠를 React 컴포넌트로 렌더링.
