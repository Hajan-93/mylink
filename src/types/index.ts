// PRD 기반 마이링크 데이터 타입 정의

export interface ProfileData {
  name: string;             // 표시 이름 (예: "전하진")
  headline: string;         // 한 줄 소속/직무 (예: "주니어 프론트엔드 개발자 · 광운대학교")
  bio: string;              // 상세 소개글
  avatarUrl: string;        // 프로필 이미지 경로 (예: "/profile.svg")
  bottomCtaText: string;    // 하단 CTA 버튼 텍스트 (예: "커피챗 신청하기 ☕")
  bottomCtaUrl: string;     // 하단 CTA 링크 (예: "mailto:contact@example.com")
}

export type SocialPlatform =
  | "github"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "x"
  | "linkedin";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

// 1. 단일 링크 아이템 인터페이스 (id, title, url 필수)
export interface LinkItem {
  id: string;               // 고유 식별자 (필수)
  title: string;            // 링크 제목 (필수)
  url: string;              // 연결 대상 URL (필수)
  desc?: string;            // 링크 상세 설명 (선택)
  emoji?: string;           // 아이콘 이모지 (선택)
  category?: string;        // 카테고리 (선택)
  order?: number;           // 정렬 순서 (선택)
  external?: boolean;       // 새 창 열기 여부 (선택)
}

// 2. 통합 콘텐츠 아이템 (섹션 헤더 or 링크 카드)
export interface ContentItem {
  id: string;               // 필수
  type: "section" | "link";
  order: number;            // 렌더링 정렬 순서
  title: string;            // 섹션 타이틀 or 링크 타이틀 (필수)
  desc?: string;            // 링크 설명
  url?: string;             // 링크 URL (type === "link" 일 때 필수)
  emoji?: string;           // 링크 카드 아이콘 이모지
  category?: string;        // 카테고리
}
