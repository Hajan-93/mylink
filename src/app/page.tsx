"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { ContentItem, ProfileData, SocialLink } from "@/types";
import { DUMMY_PROFILE, DUMMY_SOCIALS } from "@/data/dummy-data";
import { getStoredProfile, getStoredSocials, clearLegacyContents } from "@/lib/storage";
import {
  getLinksFromFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  addLinkToFirestore,
} from "@/lib/firestore";
import { ContentList } from "@/components/content-list";
import {
  AddLinkDialog,
  BottomCta,
  ProfileHeader,
  ShareButton,
} from "@/components/profile";

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(DUMMY_PROFILE);
  const [socials, setSocials] = useState<SocialLink[]>(DUMMY_SOCIALS);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      const links = await getLinksFromFirestore();
      setContents(links);
    } catch {
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // LocalStorage에 남은 더미 링크 데이터 제거
    clearLegacyContents();

    // 프로필·소셜은 LocalStorage 유지 (Firestore 미연동)
    setProfile(getStoredProfile());
    setSocials(getStoredSocials());

    // 링크 목록은 Firestore에서 불러오기
    fetchLinks();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopied = () => showToast("🔗 링크를 복사했어요!");

  // 인라인 링크 수정 처리
  const handleUpdateLink = async (
    id: string,
    updated: { title: string; url: string }
  ) => {
    await updateLinkInFirestore(id, updated);
    setContents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: updated.title, url: updated.url } : item
      )
    );
    showToast("✏️ 링크를 수정했어요!");
  };

  // 링크 삭제 처리
  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLinkFromFirestore(id);
    } catch (err) {
      console.error("Firestore 링크 삭제 실패:", err);
    }
    setContents((prev) => prev.filter((item) => item.id !== id));
    showToast("🗑️ 링크를 삭제했어요!");
  };

  // 새 링크 추가 처리
  const handleAddLink = async (newLinkData: Omit<ContentItem, "order">) => {
    if (newLinkData.type === "link") {
      try {
        await addLinkToFirestore(newLinkData);
        await fetchLinks();
        showToast("🎉 새 링크를 추가했어요!");
      } catch (err) {
        console.error("Firestore 링크 추가 실패:", err);
        showToast("링크 추가에 실패했습니다.");
      }
    }
  };

  return (
    <>
      {/* ── 1. 토스트 알림 ─────────────────────────────────── */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white bg-tds-fg-primary shadow-tds-toast transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 2. 메인 페이지 Shell ───────────────────────────── */}
      <div className="min-h-screen flex flex-col items-center pb-32 bg-tds-bg-primary">
        <main className="w-full max-w-[480px] px-5 flex flex-col gap-6">
          <ProfileHeader profile={profile} socials={socials} />

          {/* 링크 목록 및 인라인 편집 */}
          <section className="flex flex-col gap-2.5">
            {isLoading ? (
              <div className="flex flex-col gap-2.5" aria-busy="true" aria-label="링크 목록 불러오는 중">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[68px] rounded-2xl bg-tds-bg-secondary border border-tds-line-default animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ContentList
                contents={contents}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
              />
            )}

            {/* 메인 페이지에서 바로 새 링크 추가할 수 있는 버튼 */}
            <div className="pt-1">
              <AddLinkDialog onAddLink={handleAddLink} />
            </div>
          </section>

          {/* 공유하기 및 관리 바로가기 */}
          <section className="flex flex-col items-center gap-2 pt-2 pb-4">
            <ShareButton onCopied={handleCopied} />
            <Link
              href="/mylink"
              className="inline-flex items-center gap-1.5 py-1.5 px-3 text-[13px] font-medium text-tds-fg-tertiary hover:text-tds-fg-primary transition-colors no-underline select-none"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>내 링크 상세 관리</span>
            </Link>
          </section>

          {/* 푸터 */}
          <footer className="flex flex-col items-center gap-1 pb-6 text-center text-[12px] text-tds-fg-placeholder select-none">
            <p>© 2026 {profile.name}</p>
            <p>Built with Next.js · Toss Design System</p>
          </footer>
        </main>
      </div>

      {/* ── 3. Bottom CTA ──────────────────────────────────── */}
      <BottomCta text={profile.bottomCtaText} url={profile.bottomCtaUrl} />
    </>
  );
}
