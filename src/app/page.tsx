"use client";

import { useEffect, useState, useCallback } from "react";
import { ContentItem, ProfileData, SocialLink } from "@/types";
import { DUMMY_SOCIALS } from "@/data/dummy-data";
import {
  getLinksFromFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  addLinkToFirestore,
  getUserProfileFromFirestore,
  syncUserProfileToFirestore,
} from "@/lib/firestore";
import { ContentList } from "@/components/content-list";
import {
  AddLinkDialog,
  BottomCta,
  ProfileHeader,
  ShareButton,
} from "@/components/profile";
import { LoggedOutView } from "@/components/logged-out-view";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [socials] = useState<SocialLink[]>(DUMMY_SOCIALS);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 로그인한 유저의 프로필 및 링크 데이터를 Firestore에서 불러오기
  const loadUserData = useCallback(async (uid: string) => {
    try {
      setIsDataLoading(true);

      // 1. 유저 정보 조회 및 동기화 (경로: users/{user.uid})
      let userProfile = await getUserProfileFromFirestore(uid);
      if (!userProfile) {
        userProfile = await syncUserProfileToFirestore(uid, {
          name: user?.displayName || "사용자",
          avatarUrl: user?.photoURL || "/profile.svg",
          headline: user?.email ? `${user.email}` : "나만의 링크 프로필",
          bio: "새로운 링크를 추가하고 사람들과 공유해보세요. 🌱",
        });
      }
      setProfile(userProfile);

      // 2. 개인화된 링크 목록 조회 (경로: users/{user.uid}/links)
      const links = await getLinksFromFirestore(uid);
      setContents(links);
    } catch (err) {
      console.error("Firestore 데이터 로드 실패:", err);
    } finally {
      setIsDataLoading(false);
    }
  }, [user?.displayName, user?.photoURL, user?.email]);

  useEffect(() => {
    if (user?.uid) {
      loadUserData(user.uid);
    } else {
      setProfile(null);
      setContents([]);
    }
  }, [user?.uid, loadUserData]);

  // 헤더 드롭다운 등에서 프로필 수정 시 실시간 화면 반영
  useEffect(() => {
    function handleProfileUpdated(event: CustomEvent<ProfileData>) {
      if (event.detail) {
        setProfile(event.detail);
        showToast("✨ 프로필 정보를 수정했어요!");
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "mylink-profile-updated",
        handleProfileUpdated as EventListener
      );
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "mylink-profile-updated",
          handleProfileUpdated as EventListener
        );
      }
    };
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
    if (!user) {
      showToast("🔒 링크 수정은 로그인 후 가능해요.");
      return;
    }
    try {
      await updateLinkInFirestore(id, updated, user.uid);
      setContents((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: updated.title, url: updated.url } : item
        )
      );
      showToast("✏️ 링크를 수정했어요!");
    } catch (err) {
      console.error("Firestore 링크 수정 실패:", err);
      showToast("링크 수정에 실패했습니다.");
    }
  };

  // 링크 삭제 처리
  const handleDeleteLink = async (id: string) => {
    if (!user) {
      showToast("🔒 링크 삭제는 로그인 후 가능해요.");
      return;
    }
    try {
      await deleteLinkFromFirestore(id, user.uid);
      setContents((prev) => prev.filter((item) => item.id !== id));
      showToast("🗑️ 링크를 삭제했어요!");
    } catch (err) {
      console.error("Firestore 링크 삭제 실패:", err);
      showToast("링크 삭제에 실패했습니다.");
    }
  };

  // 새 링크 추가 처리
  const handleAddLink = async (newLinkData: Omit<ContentItem, "order">) => {
    if (!user) {
      showToast("🔒 링크 추가는 로그인 후 가능해요.");
      return;
    }
    if (newLinkData.type === "link") {
      try {
        await addLinkToFirestore(newLinkData, user.uid);
        await loadUserData(user.uid);
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
          className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white bg-tds-fg-primary shadow-tds-toast transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 2. 메인 페이지 Shell ───────────────────────────── */}
      <div className="min-h-screen flex flex-col items-center pb-32 bg-tds-bg-primary">
        <main className="w-full max-w-[480px] px-5 flex flex-col gap-6">
          {/* 인증 상태 로딩 중 */}
          {isAuthLoading ? (
            <div className="flex flex-col items-center pt-16 gap-4">
              <div className="w-20 h-20 rounded-full bg-tds-bg-secondary animate-pulse" />
              <div className="w-32 h-6 rounded-lg bg-tds-bg-secondary animate-pulse" />
              <div className="w-48 h-4 rounded-lg bg-tds-bg-secondary animate-pulse" />
            </div>
          ) : !user ? (
            /* 비로그인 상태: 서비스 소개 및 로그인 후 사용 안내 화면 */
            <LoggedOutView />
          ) : (
            /* 로그인 상태: Firestore의 users/{user.uid} 정보 및 개인 링크 목록 */
            <>
              {profile && <ProfileHeader profile={profile} socials={socials} />}

              {/* 링크 목록 및 인라인 편집 */}
              <section className="flex flex-col gap-2.5">
                {isDataLoading ? (
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
                    canEdit={true}
                    onUpdateLink={handleUpdateLink}
                    onDeleteLink={handleDeleteLink}
                  />
                )}

                {/* 새 링크 추가 다이얼로그 */}
                <div className="pt-1">
                  <AddLinkDialog onAddLink={handleAddLink} />
                </div>
              </section>

              {/* 공유하기 바로가기 */}
              <section className="flex flex-col items-center gap-2 pt-2 pb-4">
                <ShareButton onCopied={handleCopied} />
              </section>

              {/* 푸터 */}
              <footer className="flex flex-col items-center gap-1 pb-6 text-center text-[12px] text-tds-fg-placeholder select-none">
                <p>© 2026 {profile?.name || "MyLink"}</p>
                <p>Built with Next.js · Toss Design System</p>
              </footer>
            </>
          )}
        </main>
      </div>

      {/* ── 3. Bottom CTA (로그인 상태일 때만 노출) ────────── */}
      {user && profile && (
        <BottomCta text={profile.bottomCtaText} url={profile.bottomCtaUrl} />
      )}
    </>
  );
}
