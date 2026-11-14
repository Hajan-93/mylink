"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  Share2,
  Check,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { getUserByUsername, getLinksFromFirestore, incrementLinkClickCount } from "@/lib/firestore";
import { ProfileData, ContentItem } from "@/types";
import { ProfileHeader } from "@/components/profile";
import { useAuth } from "@/contexts/auth-context";

export default function UserPublicPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const rawUsername = params?.username as string | undefined;
  const username = rawUsername ? decodeURIComponent(rawUsername) : "";

  const [isLoading, setIsLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [ownerUid, setOwnerUid] = useState<string | null>(null);
  const [links, setLinks] = useState<ContentItem[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function loadUserPage() {
      if (!username) {
        setIsLoading(false);
        setUserFound(false);
        return;
      }

      try {
        setIsLoading(true);
        // 12주차: username으로 유저 및 프로필 검색
        const result = await getUserByUsername(username);

        if (!result) {
          setUserFound(false);
          setProfile(null);
          setLinks([]);
        } else {
          setUserFound(true);
          setOwnerUid(result.uid);
          setProfile(result.profile);

          // 찾은 userId로 users/{userId}/links 컬렉션 조회
          const userLinks = await getLinksFromFirestore(result.uid);
          setLinks(userLinks);
        }
      } catch (error) {
        console.error("유저 페이지 로드 실패:", error);
        setUserFound(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserPage();
  }, [username]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (e) {
      console.warn("클립보드 복사 실패:", e);
    }
  };

  // 13주차 핵심 요구사항: 링크 클릭 시 서버에서 원자적으로 +1 증가 (동시성 해결)
  const handleLinkClick = (linkId: string) => {
    if (ownerUid) {
      incrementLinkClickCount(ownerUid, linkId);
      // 로컬 화면 상태 즉시 반영 (낙관적 업데이트)
      setLinks((prev) =>
        prev.map((item) =>
          item.id === linkId
            ? { ...item, clickCount: (item.clickCount || 0) + 1 }
            : item
        )
      );
    }
  };

  const isOwner = user && ownerUid && user.uid === ownerUid;

  // 1. 로딩 상태 스켈레톤
  if (isLoading) {
    return (
      <div className="min-h-screen bg-tds-bg-secondary flex flex-col items-center px-5 pt-12 pb-24">
        <main className="w-full max-w-[480px] flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-tds-bg-primary border border-tds-line-default animate-pulse" />
          <div className="w-36 h-6 rounded-lg bg-tds-bg-primary animate-pulse" />
          <div className="w-56 h-4 rounded-lg bg-tds-bg-primary animate-pulse" />
          <div className="w-full flex flex-col gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[68px] w-full rounded-2xl bg-tds-bg-primary border border-tds-line-default animate-pulse"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // 2. 404 페이지 (username을 찾지 못했을 때)
  if (!userFound || !profile) {
    return (
      <div className="min-h-screen bg-tds-bg-secondary flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-[420px] p-8 rounded-3xl bg-tds-bg-primary border border-tds-line-default text-center shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-tds-fg-primary">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-[14px] text-tds-fg-secondary mt-1.5 leading-relaxed">
              <span className="font-semibold text-tds-fg-primary">@{username}</span>
              님의 마이링크 페이지가 존재하지 않거나 주소가 변경되었습니다.
            </p>
          </div>
          <div className="flex gap-2 w-full mt-2">
            <button
              onClick={() => router.back()}
              className="tds-pressed flex-1 h-12 flex items-center justify-center gap-1.5 rounded-xl border border-tds-line-default text-[14px] font-semibold text-tds-fg-secondary hover:bg-tds-bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전으로</span>
            </button>
            <Link
              href="/"
              className="tds-pressed flex-1 h-12 flex items-center justify-center rounded-xl bg-tds-bg-brand text-white text-[14px] font-semibold hover:bg-tds-bg-brand/90 transition-colors no-underline"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. 정상 개인별 페이지 렌더링 (12주차 슬라이드 38 규격)
  return (
    <div className="min-h-screen bg-tds-bg-secondary flex flex-col items-center px-5 pb-28">
      {/* 본인 페이지일 경우 편집 안내 배너 */}
      {isOwner && (
        <div className="w-full max-w-[480px] mt-4 p-3 rounded-2xl bg-tds-bg-brand-weak border border-tds-fg-brand/20 flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-1.5 text-tds-fg-brand font-medium">
            <Sparkles className="w-4 h-4" />
            <span>내 마이링크 공개 페이지를 보고 있어요.</span>
          </div>
          <Link
            href="/mylink"
            className="px-3 py-1 rounded-lg bg-tds-bg-brand text-white text-[12px] font-semibold no-underline hover:bg-tds-bg-brand/90 transition-colors"
          >
            링크 관리
          </Link>
        </div>
      )}

      <main className="w-full max-w-[480px] flex flex-col gap-6">
        {/* 상단 프로필 카드 (이름, 소개글, 아바타) */}
        <div className="relative">
          <ProfileHeader profile={profile} />

          {/* 공유 버튼 */}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleShare}
              className="tds-pressed inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-tds-bg-primary border border-tds-line-default text-[13px] font-medium text-tds-fg-secondary hover:text-tds-fg-primary shadow-sm transition-all"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">URL 복사 완료!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>마이링크 주소 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 하단 링크 리스트 (버튼 형태) */}
        <section className="flex flex-col gap-3">
          {links.length === 0 ? (
            <div className="p-8 rounded-2xl bg-tds-bg-primary border border-tds-line-default text-center text-tds-fg-tertiary">
              <LinkIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-[14px]">아직 등록된 링크가 없습니다.</p>
            </div>
          ) : (
            links.map((item) => {
              if (item.type === "section") {
                return (
                  <div key={item.id} className="pt-2 pb-1">
                    <h2 className="text-[13px] font-bold text-tds-fg-tertiary uppercase tracking-wider">
                      {item.title}
                    </h2>
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(item.id)}
                  className="tds-pressed group flex items-center justify-between p-4 rounded-2xl bg-tds-bg-primary border border-tds-line-default shadow-sm hover:border-tds-fg-brand/40 hover:shadow-md transition-all text-left no-underline"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="text-xl shrink-0 select-none">
                      {item.emoji || "🔗"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-tds-fg-primary truncate group-hover:text-tds-fg-brand transition-colors">
                        {item.title}
                      </p>
                      {item.desc && (
                        <p className="text-[12px] text-tds-fg-tertiary truncate mt-0.5">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-tds-fg-tertiary group-hover:text-tds-fg-brand shrink-0 transition-colors" />
                </a>
              );
            })
          )}
        </section>

        {/* 서비스 홍보 및 홈 바로가기 */}
        <footer className="pt-8 pb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-tds-fg-tertiary hover:text-tds-fg-primary transition-colors no-underline"
          >
            <span>Powered by</span>
            <span className="text-tds-fg-brand font-bold">MyLink</span>
          </Link>
        </footer>
      </main>
    </div>
  );
}
