"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { ContentItem, ProfileData, SocialLink } from "@/types";
import {
  DUMMY_CONTENTS,
  DUMMY_PROFILE,
  DUMMY_SOCIALS,
} from "@/data/dummy-data";
import { initializeStorage } from "@/lib/storage";
import { ContentList } from "@/components/content-list";
import {
  BottomCta,
  ProfileHeader,
  ShareButton,
} from "@/components/profile";

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(DUMMY_PROFILE);
  const [socials, setSocials] = useState<SocialLink[]>(DUMMY_SOCIALS);
  const [contents, setContents] = useState<ContentItem[]>(DUMMY_CONTENTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 마운트 시 LocalStorage에서 데이터 동기화 및 시드 주입
  useEffect(() => {
    const syncData = () => {
      const data = initializeStorage();
      setProfile(data.profile);
      setSocials(data.socials);
      setContents(data.contents);
    };

    syncData();

    // 다른 탭이나 /mylink 관리 페이지에서 LocalStorage 변경 시 실시간 동기화
    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
    };
  }, []);

  // 토스트 메시지 표시 헬퍼
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // 링크 공유 액션
  const handleCopied = () => {
    showToast("🔗 링크를 복사했어요!");
  };

  return (
    <>
      {/* ── 1. Toss 스타일 토스트 알림 ────────────────────── */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white bg-tds-fg-primary shadow-tds-toast transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 2. 메인 페이지 Shell (모바일 480px 중심 레이아웃) ─ */}
      <div className="min-h-screen flex flex-col items-center pb-32 bg-tds-bg-primary">
        <main className="w-full max-w-[480px] px-5 flex flex-col gap-6">
          {/* 프로필 헤더 (아바타, 이름, 헤드라인, 바이오, 소셜 링크 통합) */}
          <ProfileHeader profile={profile} socials={socials} />

          {/* 콘텐츠 링크 목록 영역 (방문자 전용 뷰: 삭제/수정 버튼 없음) */}
          <section className="flex flex-col gap-2">
            <ContentList contents={contents} />
          </section>

          {/* 공유하기 액션 버튼 */}
          <section className="flex flex-col items-center gap-2 pt-2 pb-4">
            <ShareButton onCopied={handleCopied} />

            {/* 관리 페이지 바로가기 (소유자 편의 제공) */}
            <Link
              href="/mylink"
              className="inline-flex items-center gap-1.5 py-1.5 px-3 text-[13px] font-medium text-tds-fg-tertiary hover:text-tds-fg-primary transition-colors no-underline select-none"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>내 링크 관리하기</span>
            </Link>
          </section>

          {/* 푸터 */}
          <footer className="flex flex-col items-center gap-1 pb-6 text-center text-[12px] text-tds-fg-placeholder select-none">
            <p>© 2026 {profile.name}</p>
            <p>Built with Next.js · Toss Design System</p>
          </footer>
        </main>
      </div>

      {/* ── 3. 화면 하단 고정 Bottom CTA ───────────────────── */}
      <BottomCta
        text={profile.bottomCtaText}
        url={profile.bottomCtaUrl}
      />
    </>
  );
}