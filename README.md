<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Something Web - Portfolio Project

이 프로젝트는 모션 그래픽 디자이너의 포트폴리오 웹사이트입니다.
추상적인 개념을 시각적 언어로 번역한다는 철학을 바탕으로, 잉크 번짐, 스크롤 인터랙션 등 감각적인 웹 경험을 제공합니다.

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

1.  **세부 페이지(Project Detail) 디자인 고도화**
    *   현재 모달 내부의 디자인 및 레이아웃 개선이 필요합니다.
    *   각 프로젝트별 상세 이미지, 영상, 텍스트 배치 작업을 진행할 예정입니다.

2.  **모바일 반응형 최적화**
    *   모바일 환경에서도 잉크 효과와 모달 인터랙션이 매끄럽게 작동하도록 최적화가 필요합니다.

3.  **성능 최적화**
    *   이미지 프레임 시퀀스 로딩 속도 개선 및 메모리 관리.

---

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
