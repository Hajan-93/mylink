// 백엔드 REST API 응답 공통 포맷 및 DTO 정의

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiLinkItem {
  id: string;               // 필수
  title: string;            // 필수
  url: string;              // 필수
  desc?: string;
  emoji?: string;
  category?: string;
  order?: number;
  isActive: boolean;
  clickCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSocialLink {
  id: string;
  platform: "github" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin";
  url: string;
  isActive: boolean;
}

export interface ApiProfileData {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  bottomCtaText: string;
  bottomCtaUrl: string;
  skills: string[];
  highlights: {
    emoji: string;
    value: string;
    label: string;
    sub: string;
  }[];
  socials: ApiSocialLink[];
}
