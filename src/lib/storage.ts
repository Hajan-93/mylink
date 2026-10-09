import { ContentItem, ProfileData, SocialLink } from "@/types";
import {
  DUMMY_CONTENTS,
  DUMMY_PROFILE,
  DUMMY_SOCIALS,
} from "@/data/dummy-data";

export const STORAGE_KEYS = {
  PROFILE: "mylink_profile",
  SOCIALS: "mylink_socials",
  CONTENTS: "mylink_contents",
} as const;

/**
 * 안전하게 LocalStorage에서 프로필 데이터를 가져옵니다.
 * 데이터가 없거나 파싱 오류가 발생하면 기본 시드 데이터를 주입하고 반환합니다.
 */
export function getStoredProfile(): ProfileData {
  if (typeof window === "undefined") {
    return DUMMY_PROFILE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify(DUMMY_PROFILE)
      );
      return DUMMY_PROFILE;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.name) {
      return parsed as ProfileData;
    }
    throw new Error("Invalid profile schema");
  } catch (error) {
    console.warn("프로필 데이터 로드 실패, 기본값으로 복구합니다:", error);
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify(DUMMY_PROFILE)
      );
    } catch {
      /* ignore */
    }
    return DUMMY_PROFILE;
  }
}

/**
 * 안전하게 LocalStorage에서 소셜 미디어 링크 목록을 가져옵니다.
 */
export function getStoredSocials(): SocialLink[] {
  if (typeof window === "undefined") {
    return DUMMY_SOCIALS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.SOCIALS);
    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEYS.SOCIALS,
        JSON.stringify(DUMMY_SOCIALS)
      );
      return DUMMY_SOCIALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as SocialLink[];
    }
    throw new Error("Invalid socials schema");
  } catch (error) {
    console.warn("소셜 링크 데이터 로드 실패, 기본값으로 복구합니다:", error);
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SOCIALS,
        JSON.stringify(DUMMY_SOCIALS)
      );
    } catch {
      /* ignore */
    }
    return DUMMY_SOCIALS;
  }
}

/**
 * 안전하게 LocalStorage에서 통합 콘텐츠(섹션 및 링크) 목록을 가져옵니다.
 * order 기준으로 오름차순 정렬하여 반환합니다.
 */
export function getStoredContents(): ContentItem[] {
  if (typeof window === "undefined") {
    return [...DUMMY_CONTENTS].sort((a, b) => a.order - b.order);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CONTENTS);
    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEYS.CONTENTS,
        JSON.stringify(DUMMY_CONTENTS)
      );
      return [...DUMMY_CONTENTS].sort((a, b) => a.order - b.order);
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return (parsed as ContentItem[]).sort((a, b) => a.order - b.order);
    }
    throw new Error("Invalid contents schema");
  } catch (error) {
    console.warn("콘텐츠 데이터 로드 실패, 기본값으로 복구합니다:", error);
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.CONTENTS,
        JSON.stringify(DUMMY_CONTENTS)
      );
    } catch {
      /* ignore */
    }
    return [...DUMMY_CONTENTS].sort((a, b) => a.order - b.order);
  }
}

/**
 * 모든 마이링크 스토리지를 초기화 및 로드합니다.
 */
export function initializeStorage(): {
  profile: ProfileData;
  socials: SocialLink[];
  contents: ContentItem[];
} {
  return {
    profile: getStoredProfile(),
    socials: getStoredSocials(),
    contents: getStoredContents(),
  };
}

/**
 * 프로필 정보 저장
 */
export function saveStoredProfile(profile: ProfileData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

/**
 * 소셜 정보 저장
 */
export function saveStoredSocials(socials: SocialLink[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.SOCIALS, JSON.stringify(socials));
}

/**
 * 콘텐츠 목록 저장
 */
export function saveStoredContents(contents: ContentItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.CONTENTS, JSON.stringify(contents));
}
