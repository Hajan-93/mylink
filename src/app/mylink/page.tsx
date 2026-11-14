"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Link as LinkIcon, Sparkles, Copy, Check, UserCheck } from "lucide-react";
import { ContentItem, ProfileData } from "@/types";
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  getUserProfileFromFirestore,
  incrementLinkClickCount,
} from "@/lib/firestore";
import { ContentList } from "@/components/content-list";
import { AddLinkDialog, EditProfileDialog, LinkAnalytics } from "@/components/profile";
import { LoggedOutView } from "@/components/logged-out-view";
import { useAuth } from "@/contexts/auth-context";

export default function MyLinkPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 프로필 정보 불러오기
  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const p = await getUserProfileFromFirestore(uid);
      setProfile(p);
    } catch (e) {
      console.warn("프로필 조회 실패:", e);
    }
  }, []);

  // Firestore에서 로그인된 유저의 링크 목록 불러오기 (경로: users/{user.uid}/links)
  const fetchLinks = useCallback(async (uid: string) => {
    try {
      setIsLoading(true);
      const links = await getLinksFromFirestore(uid);
      setContents(links);
    } catch (error) {
      console.error("Firestore 불러오기 실패:", error);
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchLinks(user.uid);
      fetchProfile(user.uid);
    } else {
      setContents([]);
      setProfile(null);
    }
  }, [user?.uid, fetchLinks, fetchProfile]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddLink = async (newLinkData: Omit<ContentItem, "order">) => {
    if (!user) {
      showToast("🔒 링크 추가는 로그인 후 가능해요.");
      return;
    }

    if (newLinkData.type === "link") {
      try {
        await addLinkToFirestore(newLinkData, user.uid);
        await fetchLinks(user.uid);
        showToast("🎉 새 링크를 추가했어요!");
      } catch (error) {
        console.error("Firestore 저장 실패:", error);
        showToast("링크 추가에 실패했습니다.");
      }
    }
  };

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
      console.error("Firestore 수정 실패:", err);
      showToast("링크 수정에 실패했습니다.");
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!user) {
      showToast("🔒 링크 삭제는 로그인 후 가능해요.");
      return;
    }
    try {
      await deleteLinkFromFirestore(id, user.uid);
      const updatedContents = contents.filter((item) => item.id !== id);
      setContents(updatedContents);
      showToast("🗑️ 링크를 삭제했어요!");
    } catch (error) {
      console.error("Firestore 삭제 실패:", error);
      showToast("링크 삭제에 실패했습니다.");
    }
  };

  // 13주차: 링크 클릭 시 서버에서 +1 카운트 증가 & 실시간 통계 반영
  const handleLinkClick = (id: string) => {
    if (user?.uid) {
      incrementLinkClickCount(user.uid, id);
      setContents((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, clickCount: (item.clickCount || 0) + 1 }
            : item
        )
      );
    }
  };

  const linkCount = contents.filter((c) => c.type === "link").length;

  return (
    <>
      {/* ── 1. Toss 스타일 토스트 알림 ────────────────────── */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white bg-tds-fg-primary shadow-tds-toast transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 2. 메인 관리 화면 셸 ──────────────────────────── */}
      <div className="min-h-screen flex flex-col items-center pb-28 bg-tds-bg-secondary">
        <main className="w-full max-w-[480px] px-5 flex flex-col gap-5 pt-8">
          {/* 상단 네비게이션 헤더 */}
          <header className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-tds-fg-secondary hover:text-tds-fg-primary transition-colors no-underline w-fit py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>내 프로필 보기</span>
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-tds-fg-primary">
                  내 링크 관리
                </h1>
                <p className="text-[14px] text-tds-fg-secondary mt-0.5">
                  {user
                    ? `${user.displayName || "회원"}님의 링크를 추가하고 관리해요.`
                    : "로그인 후 나만의 링크를 추가하고 관리할 수 있습니다."}
                </p>
              </div>

              {user && (
                <Link
                  href="/"
                  target="_blank"
                  title="새 탭에서 프로필 열기"
                  className="tds-pressed w-10 h-10 flex items-center justify-center rounded-xl bg-tds-bg-primary border border-tds-line-default text-tds-fg-secondary hover:text-tds-fg-brand transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          </header>

          {/* 비로그인 상태일 때: 설명 문구 및 로그인 유도 컴포넌트 렌더링 */}
          {isAuthLoading ? (
            <div className="flex flex-col gap-3 py-10" aria-busy="true">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[68px] rounded-2xl bg-tds-bg-primary border border-tds-line-default animate-pulse"
                />
              ))}
            </div>
          ) : !user ? (
            <LoggedOutView />
          ) : (
            <>
              {/* 12주차: 내 마이링크 공유 URL 안내 및 프로필 수정 카드 */}
              <section className="p-4 bg-tds-bg-primary border border-tds-line-default rounded-2xl shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-tds-fg-secondary">
                      내 마이링크 공유 주소
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-tds-bg-brand-weak text-tds-fg-brand">
                      공유 가능
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="tds-pressed inline-flex items-center gap-1 text-[12px] font-semibold text-tds-fg-brand hover:underline"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>프로필/아이디 수정</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-tds-bg-secondary border border-tds-line-default">
                  <Link
                    href={`/${profile?.username || ""}`}
                    target="_blank"
                    className="text-[14px] font-bold text-tds-fg-primary hover:text-tds-fg-brand truncate pr-2 no-underline flex items-center gap-1.5"
                  >
                    <span>/{profile?.username || "loading..."}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-tds-fg-tertiary" />
                  </Link>

                  <button
                    onClick={async () => {
                      if (!profile?.username) return;
                      const origin = typeof window !== "undefined" ? window.location.origin : "";
                      const fullUrl = `${origin}/${profile.username}`;
                      try {
                        await navigator.clipboard.writeText(fullUrl);
                        setIsCopied(true);
                        showToast("🔗 마이링크 주소를 복사했어요!");
                        setTimeout(() => setIsCopied(false), 2000);
                      } catch {
                        showToast("복사에 실패했습니다.");
                      }
                    }}
                    className="tds-pressed shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-tds-bg-primary border border-tds-line-default text-[12px] font-semibold text-tds-fg-secondary hover:text-tds-fg-primary shadow-xs transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>주소 복사</span>
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* 링크 요약 카드 */}
              <section className="flex items-center justify-between p-4 bg-tds-bg-primary border border-tds-line-default rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-tds-bg-brand-weak text-tds-fg-brand">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] text-tds-fg-tertiary">현재 등록된 링크</p>
                    <p className="text-[17px] font-bold text-tds-fg-primary tabular-nums">
                      {linkCount}개
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[13px] font-medium text-tds-fg-brand">
                  <Sparkles className="w-4 h-4" />
                  <span>실시간 동기화 중</span>
                </div>
              </section>

              {/* 새 링크 추가 다이얼로그 버튼 */}
              <section>
                <AddLinkDialog onAddLink={handleAddLink} />
              </section>

              {/* 링크 목록 및 인라인 수정 / 삭제 관리 */}
              <section className="flex flex-col gap-2">
                {isLoading ? (
                  // 스켈레톤 UI
                  <div className="flex flex-col gap-2.5" aria-busy="true" aria-label="링크 목록 불러오는 중">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-[68px] rounded-2xl bg-tds-bg-primary border border-tds-line-default animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <ContentList
                    contents={contents}
                    canEdit={true}
                    onClickLink={handleLinkClick}
                    onUpdateLink={handleUpdateLink}
                    onDeleteLink={handleDeleteLink}
                  />
                )}
              </section>

              {/* 13주차: 마이페이지 링크 클릭 통계 섹션 */}
              <LinkAnalytics contents={contents} />
            </>
          )}
        </main>
      </div>

      {/* ── 3. 화면 하단 고정 바로가기 CTA (로그인 상태일 때만 노출) ─── */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-5 pb-6 pt-6 pointer-events-none bg-gradient-to-b from-transparent via-tds-bg-secondary/70 to-tds-bg-secondary">
          <Link
            href="/"
            className="tds-pressed pointer-events-auto w-full max-w-[480px] h-14 flex items-center justify-center gap-2 text-[16px] font-semibold text-white bg-tds-bg-brand rounded-full shadow-md active:scale-[0.99] transition-all no-underline"
          >
            <span>내 프로필 확인하러 가기</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      )}
      {/* ── 4. 프로필 수정 다이얼로그 ──────────────────── */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onSuccess={(updated) => {
          setProfile(updated);
          showToast("✨ 프로필 정보를 수정했어요!");
        }}
      />
    </>
  );
}
