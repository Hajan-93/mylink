"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Link as LinkIcon, Sparkles } from "lucide-react";
import { ContentItem } from "@/types";
import { DUMMY_CONTENTS } from "@/data/dummy-data";
import { initializeStorage, saveStoredContents } from "@/lib/storage";
import { ContentList } from "@/components/content-list";
import { AddLinkDialog } from "@/components/profile";

export default function MyLinkPage() {
  const [contents, setContents] = useState<ContentItem[]>(DUMMY_CONTENTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const syncData = () => {
      const data = initializeStorage();
      setContents(data.contents);
    };

    syncData();

    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddLink = (newLinkData: Omit<ContentItem, "order">) => {
    const maxOrder = contents.reduce(
      (max, item) => Math.max(max, item.order ?? 0),
      0
    );

    const newContentItem: ContentItem = {
      ...newLinkData,
      order: maxOrder + 1,
    };

    const updatedContents = [...contents, newContentItem];
    setContents(updatedContents);
    saveStoredContents(updatedContents);

    showToast("🎉 새 링크를 추가했어요!");
  };

  const handleDeleteLink = (id: string) => {
    const updatedContents = contents.filter((item) => item.id !== id);
    setContents(updatedContents);
    saveStoredContents(updatedContents);
    showToast("🗑️ 링크를 삭제했어요!");
  };

  const linkCount = contents.filter((c) => c.type === "link").length;

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
                  프로필에 노출될 링크를 추가하고 관리해요.
                </p>
              </div>

              <Link
                href="/"
                target="_blank"
                title="새 탭에서 프로필 열기"
                className="tds-pressed w-10 h-10 flex items-center justify-center rounded-xl bg-tds-bg-primary border border-tds-line-default text-tds-fg-secondary hover:text-tds-fg-brand transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </header>

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

          {/* 링크 목록 및 삭제 관리 */}
          <section className="flex flex-col gap-2">
            <ContentList contents={contents} onDeleteLink={handleDeleteLink} />
          </section>
        </main>
      </div>

      {/* ── 3. 화면 하단 고정 바로가기 CTA ─────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-5 pb-6 pt-6 pointer-events-none bg-gradient-to-b from-transparent via-tds-bg-secondary/70 to-tds-bg-secondary">
        <Link
          href="/"
          className="tds-pressed pointer-events-auto w-full max-w-[480px] h-14 flex items-center justify-center gap-2 text-[16px] font-semibold text-white bg-tds-bg-brand rounded-full shadow-md active:scale-[0.99] transition-all no-underline"
        >
          <span>내 프로필 확인하러 가기</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </>
  );
}
