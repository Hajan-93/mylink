"use client";

import { useEffect, useState } from "react";
import { ContentItem, ProfileData, SocialLink } from "@/types";
import {
  DUMMY_CONTENTS,
  DUMMY_PROFILE,
  DUMMY_SOCIALS,
} from "@/data/dummy-data";
import { initializeStorage } from "@/lib/storage";
import { ContentList } from "@/components/content-list";
import { BottomCta, ProfileHeader, ShareButton } from "@/components/profile";

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(DUMMY_PROFILE);
  const [socials, setSocials] = useState<SocialLink[]>(DUMMY_SOCIALS);
  const [contents, setContents] = useState<ContentItem[]>(DUMMY_CONTENTS);
  const [copied, setCopied] = useState(false);

  // 마운트 시 LocalStorage에서 데이터 동기화 및 시드 주입
  useEffect(() => {
    const syncData = () => {
      const data = initializeStorage();
      setProfile(data.profile);
      setSocials(data.socials);
      setContents(data.contents);
    };

    syncData();

    // 다른 탭이나 창에서 LocalStorage 변경 시 동기화
    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const handleCopied = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <>
      {/* ── 1. Toss 스타일 토스트 알림 ────────────────────── */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white bg-tds-fg-primary shadow-tds-toast transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span>🔗</span>
          <span>링크를 복사했어요!</span>
        </div>
      )}

      {/* ── 2. 메인 페이지 Shell (모바일 480px 중심 레이아웃) ─ */}
      <div className="min-h-screen flex flex-col items-center pb-32 bg-tds-bg-primary">
        <main className="w-full max-w-[480px] px-5 flex flex-col gap-6">
          {/* 프로필 헤더 (아바타, 이름, 헤드라인, 바이오, 소셜 링크 통합) */}
          <ProfileHeader profile={profile} socials={socials} />

          {/* 콘텐츠 링크 목록 영역 */}
          <section className="flex flex-col gap-2">
            <ContentList contents={contents} />
          </section>

          {/* 공유하기 액션 버튼 */}
          <section className="flex justify-center pt-2 pb-4">
            <ShareButton onCopied={handleCopied} />
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