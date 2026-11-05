"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { EditProfileDialog } from "@/components/profile";
import {
  LogOut,
  User as UserIcon,
  Loader2,
  ChevronDown,
  Copy,
  Check,
  Sparkles,
  UserPen,
} from "lucide-react";

export function Header() {
  const { user, isLoading, signInWithGoogle, logout } = useAuth();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [customDisplayName, setCustomDisplayName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 프로필 업데이트 이벤트 리스너 등록
  useEffect(() => {
    function handleProfileUpdated(event: CustomEvent<{ name?: string }>) {
      if (event.detail?.name) {
        setCustomDisplayName(event.detail.name);
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

  // 외부 클릭 및 ESC 키 입력 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogin = async () => {
    try {
      setIsActionLoading(true);
      await signInWithGoogle();
    } catch {
      // 팝업 에러 등은 콘솔 처리됨
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsActionLoading(true);
      setIsDropdownOpen(false);
      await logout();
      router.push("/");
    } catch {
      // 로그아웃 실패 처리
    } finally {
      setIsActionLoading(false);
    }
  };

  // 프로필 링크 클립보드 복사
  const handleCopyProfileLink = async () => {
    try {
      const profileUrl = typeof window !== "undefined" ? window.location.origin : "";
      if (navigator.clipboard && profileUrl) {
        await navigator.clipboard.writeText(profileUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  const displayName =
    customDisplayName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "사용자");

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-tds-line-default bg-tds-bg-primary/80 backdrop-blur-md">
        <div className="max-w-[480px] mx-auto px-5 h-14 flex items-center justify-between">
          {/* 서비스 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 text-tds-fg-primary font-bold text-lg tracking-tight no-underline select-none hover:opacity-80 transition-opacity"
          >
            <span className="w-7 h-7 rounded-xl bg-tds-bg-brand flex items-center justify-center text-white text-[14px]">
              🔗
            </span>
            <span>MyLink</span>
          </Link>

          {/* 우측 인증 영역 */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-24 rounded-full bg-tds-bg-secondary animate-pulse" />
            ) : user ? (
              /* 로그인 상태: 프로필 드롭다운 메뉴 */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 py-1 px-2.5 bg-tds-bg-secondary hover:bg-tds-bg-brand-weak active:scale-98 rounded-full border border-tds-line-default transition-all cursor-pointer select-none"
                >
                  {user.photoURL ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-black/10">
                      <Image
                        src={user.photoURL}
                        alt={displayName}
                        width={24}
                        height={24}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-tds-bg-brand text-white flex items-center justify-center shrink-0">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <span className="text-[13px] font-semibold text-tds-fg-primary max-w-[85px] sm:max-w-[120px] truncate">
                    {displayName}
                  </span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-tds-fg-secondary transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-tds-fg-brand" : ""
                    }`}
                  />
                </button>

                {/* 드롭다운 메뉴 팝오버 */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-tds-bg-primary rounded-2xl shadow-tds-dropdown border border-tds-line-default p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* 1. 계정 요약 정보 카드 */}
                    <div className="flex items-center gap-3 p-3 bg-tds-bg-secondary rounded-xl">
                      {user.photoURL ? (
                        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-tds-line-default shadow-sm">
                          <Image
                            src={user.photoURL}
                            alt={displayName}
                            width={44}
                            height={44}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-tds-bg-brand text-white flex items-center justify-center font-bold text-[16px] shrink-0">
                          {displayName.charAt(0)}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-bold text-tds-fg-primary truncate">
                            {displayName}
                          </span>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 shrink-0">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Google</span>
                          </span>
                        </div>
                        {user.email && (
                          <span className="text-[12px] text-tds-fg-tertiary truncate">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. 구분선 */}
                    <div className="h-px bg-tds-line-default my-1" />

                    {/* 3. 프로필 링크 복사 기능 */}
                    <button
                      type="button"
                      onClick={handleCopyProfileLink}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-tds-fg-primary hover:text-tds-fg-brand hover:bg-tds-bg-brand-weak rounded-xl transition-colors cursor-pointer text-left select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-600 shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-tds-fg-secondary shrink-0" />
                        )}
                        <span>프로필 링크 복사</span>
                      </div>
                      {isCopied && (
                        <span className="text-[11px] font-semibold text-green-600 animate-in fade-in">
                          복사 완료!
                        </span>
                      )}
                    </button>

                    {/* 4. 프로필 수정 버튼 */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsEditProfileOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-tds-fg-secondary hover:text-tds-fg-brand hover:bg-tds-bg-brand-weak rounded-xl transition-colors cursor-pointer text-left select-none"
                    >
                      <UserPen className="w-4 h-4 text-tds-fg-tertiary shrink-0" />
                      <span>프로필 수정</span>
                    </button>

                    {/* 5. 구분선 */}
                    <div className="h-px bg-tds-line-default my-1" />

                    {/* 6. 로그아웃 */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isActionLoading}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-tds-fg-secondary hover:text-tds-fg-danger hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left select-none disabled:opacity-50"
                    >
                      {isActionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-tds-fg-danger" />
                      ) : (
                        <LogOut className="w-4 h-4 shrink-0" />
                      )}
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 로그아웃 상태: "Google로 로그인" 버튼 */
              <button
                type="button"
                onClick={handleLogin}
                disabled={isActionLoading}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-tds-bg-primary border border-tds-line-default hover:border-tds-line-strong hover:bg-tds-bg-secondary active:scale-[0.98] rounded-full text-[13px] font-semibold text-tds-fg-primary shadow-sm transition-all cursor-pointer disabled:opacity-50 select-none"
              >
                {isActionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-tds-fg-brand" />
                ) : (
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>Google로 로그인</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 프로필 정보 수정 모달 */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onSuccess={(updated) => {
          setCustomDisplayName(updated.name);
        }}
      />
    </>
  );
}
