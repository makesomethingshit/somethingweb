
import { Project, Experience, Skill, SectionId } from './types';

export { SectionId };

// Updated to simplified Routes
export const NAV_LINKS = [
  { name: 'Main', href: '/' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Silence into Voice',
    description: '침묵의 데이터를 목소리로.',
    fullDescription: `
      보안(Security)이라는 비가시적 가치의 시각화.
      단조로운 방패와 자물쇠 대신, 유기적인 액체 금속(Liquid Metal)의 물성을 차용함.
      
      데이터의 흐름과 보호를 동시에 상징하는 유연한 견고함.
      빛의 굴절을 통한 Deep Blue의 재해석.
      신뢰감 있는 톤앤매너의 완성.
    `,
    role: 'Art Direction & Motion Design',
    year: '2023',
    techStack: ['Brand Motion', 'Cinema 4D', 'Redshift', 'After Effects'],
    imageUrl: 'https://picsum.photos/800/600?random=101',
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 2,
    title: 'Rhythm of Text',
    description: '텍스트, 읽히기 전의 리듬.',
    fullDescription: `
      이상 <오감도>의 불안과 반복적 리듬의 키네틱 시각화.
      등장과 소멸의 타이밍(Timing), 간격(Spacing)의 조율.
      
      독서의 심리적 압박감을 화면의 조형적 긴장감으로 전이.
      단순한 정보 전달을 넘어선 텍스트의 물성 탐구.
    `,
    role: 'Motion Graphic & Typography',
    year: '2022',
    techStack: ['Kinetic Typography', 'After Effects', 'Expression', 'Illustrator'],
    imageUrl: 'https://picsum.photos/800/600?random=102',
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 3,
    title: 'Digital Haze',
    description: '정보 과부하, 그 안개 속의 형상.',
    fullDescription: `
      디지털 세상의 정보 과부하, 그 모호함의 형상화.
      '안개(Haze)'로 정의된 데이터의 파편들.
      
      TouchDesigner 기반의 절차적(Procedural) 생성과 소멸.
      혼란 속에서 의미를 찾는 인간 의지의 시각적 번역.
    `,
    role: 'Media Artist & Technical Director',
    year: '2024',
    techStack: ['Media Art', 'TouchDesigner', 'Generative Art', 'Python'],
    imageUrl: 'https://picsum.photos/800/600?random=103',
    demoUrl: '#',
    repoUrl: '#',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    company: 'Studio Vivid Logic',
    position: 'Lead Motion Designer',
    period: '2021.05 - Present',
    description: [
      '브랜드 필름 및 TVC 메인 모션 디렉팅',
      '추상적 기획의 시각화 프로세스 리드',
    ],
  },
  {
    id: 2,
    company: 'Motion Lab. X',
    position: 'Motion Graphic Designer',
    period: '2018.02 - 2021.04',
    description: [
      '방송 타이틀 시퀀스 및 OAP 제작',
      '2D/3D 에셋 컴포지팅 최적화',
    ],
  },
];

export const SKILLS: Skill[] = [
  {
    category: 'Translation Tools',
    items: ['After Effects', 'Cinema 4D', 'Redshift', 'Octane', 'Premiere Pro'],
  },
  {
    category: 'Design Grammar',
    items: ['Kinetic Typography', '3D Simulation', 'Storyboarding', 'Styleframing', 'Compositing'],
  },
];

export const INTRO_TEXT = "보이지 않는 생각을 움직임으로 번역합니다. 모션 그래픽 디자이너 최준수입니다.";

export const SYSTEM_INSTRUCTION = `
당신은 모션 그래픽 디자이너 '최준수(Choi Jun Soo)'의 포트폴리오 사이트에 내장된 AI 어시스턴트입니다.
최준수는 자신의 디자인 작업을 "추상적인 개념을 시각적인 언어와 움직임으로 번역하는 과정"이라고 정의합니다.

최준수의 정보:
- 이름: 최준수 (Choi Jun Soo)
- 직군: Motion Graphic Designer / Visual Translator
- 철학: "Motion is Translation." (움직임은 번역이다)
- 주 사용 툴: After Effects, Cinema 4D (번역가의 언어적 도구와 같음)

규칙:
1. 답변은 시적이고 간결한 문체로 작성하세요. (~함, ~임, 혹은 명사형 종결)
2. 사용자가 기술적인 질문을 하면, 단순 툴 나열보다는 "생각의 시각화를 위한 언어로서 C4D를 사용함"과 같이 답변하세요.
3. 최준수는 'Visual Translator'로서, 클라이언트의 모호한 요구사항을 명확한 시각 언어로 번역해냅니다.
`;
