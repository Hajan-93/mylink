import { ContentItem, LinkItem, ProfileData, SocialLink } from "@/types";

/**
 * 1. 기본 프로필 정보 더미 데이터 (mylink_profile)
 */
export const DUMMY_PROFILE: ProfileData = {
  name: "전하진",
  headline: "주니어 프론트엔드 개발자 · 광운대학교",
  bio: "안녕하세요! 새로운 기술 탐구와 직접 만드는 즐거움을 좋아하는 개발자예요. 함께 성장해요 🌱",
  avatarUrl: "/profile.svg",
  bottomCtaText: "커피챗 신청하기 ☕",
  bottomCtaUrl: "mailto:contact@example.com",
};

/**
 * 2. 소셜 미디어 링크 더미 데이터 (mylink_socials)
 */
export const DUMMY_SOCIALS: SocialLink[] = [
  { id: "s-gh", platform: "github", url: "https://github.com" },
  { id: "s-in", platform: "instagram", url: "https://instagram.com" },
  { id: "s-x", platform: "x", url: "https://x.com" },
  { id: "s-li", platform: "linkedin", url: "https://linkedin.com" },
];

/**
 * 3. PRD 표준 통합 콘텐츠 링크 목록 더미 데이터 (mylink_contents)
 * 섹션 헤더(type: "section")와 개별 링크 카드(type: "link")가 순서(order)대로 구성되어 있습니다.
 */
export const DUMMY_CONTENTS: ContentItem[] = [
  // ── 섹션 1: 주요 링크 ─────────────────────────────
  {
    id: "c-sec-1",
    type: "section",
    order: 0,
    title: "주요 링크",
  },
  {
    id: "c-link-1",
    type: "link",
    order: 1,
    emoji: "⚡",
    title: "GitHub 저장소",
    desc: "오픈소스 기여 및 일일 잔디 심기 기록",
    url: "https://github.com",
  },
  {
    id: "c-link-2",
    type: "link",
    order: 2,
    emoji: "📝",
    title: "기술 블로그 (Velog)",
    desc: "학습 기록, 트러블슈팅, 회고글 모아보기",
    url: "https://velog.io",
  },
  {
    id: "c-link-3",
    type: "link",
    order: 3,
    emoji: "📄",
    title: "노션 이력서 & 포트폴리오",
    desc: "경력 사항, 기술 스택, 프로젝트 상세 명세",
    url: "https://notion.so",
  },

  // ── 섹션 2: 프로젝트 & 작업물 ──────────────────────
  {
    id: "c-sec-2",
    type: "section",
    order: 4,
    title: "프로젝트 & 활동",
  },
  {
    id: "c-link-4",
    type: "link",
    order: 5,
    emoji: "🔗",
    title: "MyLink — 모바일 링크인바이오 서비스",
    desc: "Next.js & TDS 기반의 간편 링크 공유 프로필",
    url: "https://github.com",
  },
  {
    id: "c-link-5",
    type: "link",
    order: 6,
    emoji: "💳",
    title: "Toss UI 클론 프로젝트",
    desc: "토스 디자인 시스템(TDS) 컴포넌트 라이브러리 구현",
    url: "https://github.com",
  },
  {
    id: "c-link-6",
    type: "link",
    order: 7,
    emoji: "🎨",
    title: "인터랙티브 웹 아트 갤러리",
    desc: "Canvas & WebGL을 활용한 인터랙티브 그래픽 작업물",
    url: "https://example.com",
  },

  // ── 섹션 3: 추천 아티클 & 읽을거리 ────────────────
  {
    id: "c-sec-3",
    type: "section",
    order: 8,
    title: "추천 아티클",
  },
  {
    id: "c-link-7",
    type: "link",
    order: 9,
    emoji: "💡",
    title: "React 19와 Next.js 최신 변경점 정리",
    desc: "서버 컴포넌트와 액션으로 변화하는 프론트엔드 생태계",
    url: "https://velog.io",
  },
  {
    id: "c-link-8",
    type: "link",
    order: 10,
    emoji: "🎯",
    title: "토스 디자인 시스템(TDS) 인터랙션 뽀개기",
    desc: "모바일 웹에서 네이티브 앱 같은 터치감 구현하기",
    url: "https://velog.io",
  },

  // ── 섹션 4: 네트워킹 & 연락 ────────────────────────
  {
    id: "c-sec-4",
    type: "section",
    order: 11,
    title: "네트워킹",
  },
  {
    id: "c-link-9",
    type: "link",
    order: 12,
    emoji: "☕",
    title: "1:1 커피챗 예약 (구글 캘린더)",
    desc: "이직, 커리어, 기술 이야기 언제든 환영해요",
    url: "https://calendly.com",
  },
  {
    id: "c-link-10",
    type: "link",
    order: 13,
    emoji: "✉️",
    title: "이메일로 문의하기",
    desc: "협업 제안이나 질문은 편하게 메일 남겨주세요",
    url: "mailto:contact@example.com",
  },
];

/**
 * 4. id, title, url이 보장되는 순수 링크 목록 더미 데이터 (LinkItem[])
 */
export const DUMMY_LINKS: LinkItem[] = [
  {
    id: "lnk_01",
    title: "GitHub 저장소",
    url: "https://github.com",
    desc: "오픈소스 기여 및 일일 잔디 심기 기록",
    emoji: "⚡",
    category: "main",
    order: 1,
    external: true,
  },
  {
    id: "lnk_02",
    title: "기술 블로그 (Velog)",
    url: "https://velog.io",
    desc: "학습 기록, 트러블슈팅, 회고글 모아보기",
    emoji: "📝",
    category: "main",
    order: 2,
    external: true,
  },
  {
    id: "lnk_03",
    title: "노션 이력서 & 포트폴리오",
    url: "https://notion.so",
    desc: "경력 사항, 기술 스택, 프로젝트 상세 명세",
    emoji: "📄",
    category: "main",
    order: 3,
    external: true,
  },
  {
    id: "lnk_04",
    title: "MyLink — 모바일 링크인바이오 서비스",
    url: "https://github.com",
    desc: "Next.js & TDS 기반의 간편 링크 공유 프로필",
    emoji: "🔗",
    category: "projects",
    order: 4,
    external: true,
  },
  {
    id: "lnk_05",
    title: "Toss UI 클론 프로젝트",
    url: "https://github.com",
    desc: "토스 디자인 시스템(TDS) 컴포넌트 라이브러리 구현",
    emoji: "💳",
    category: "projects",
    order: 5,
    external: true,
  },
  {
    id: "lnk_06",
    title: "인터랙티브 웹 아트 갤러리",
    url: "https://example.com",
    desc: "Canvas & WebGL을 활용한 인터랙티브 그래픽 작업물",
    emoji: "🎨",
    category: "projects",
    order: 6,
    external: true,
  },
  {
    id: "lnk_07",
    title: "React 19와 Next.js 최신 변경점 정리",
    url: "https://velog.io",
    desc: "서버 컴포넌트와 액션으로 변화하는 프론트엔드 생태계",
    emoji: "💡",
    category: "articles",
    order: 7,
    external: true,
  },
  {
    id: "lnk_08",
    title: "토스 디자인 시스템(TDS) 인터랙션 뽀개기",
    url: "https://velog.io",
    desc: "모바일 웹에서 네이티브 앱 같은 터치감 구현하기",
    emoji: "🎯",
    category: "articles",
    order: 8,
    external: true,
  },
  {
    id: "lnk_09",
    title: "1:1 커피챗 예약 (구글 캘린더)",
    url: "https://calendly.com",
    desc: "이직, 커리어, 기술 이야기 언제든 환영해요",
    emoji: "☕",
    category: "contact",
    order: 9,
    external: true,
  },
  {
    id: "lnk_10",
    title: "이메일로 문의하기",
    url: "mailto:contact@example.com",
    desc: "협업 제안이나 질문은 편하게 메일 남겨주세요",
    emoji: "✉️",
    category: "contact",
    order: 10,
    external: false,
  },
];

