"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Sparkles, ShieldCheck, ArrowRight, Loader2, Link2, Share2, Palette } from "lucide-react";

export function LoggedOutView() {
  const { signInWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch {
      // 에러는 auth-context에서 처리
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 py-6 select-none animate-in fade-in duration-300">
      {/* ── 1. 히어로 인트로 ───────────────────────────────── */}
      <section className="flex flex-col items-center text-center gap-3.5 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tds-bg-brand-weak text-tds-fg-brand text-[12px] font-semibold border border-tds-bg-brand/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>모바일 링크인바이오 서비스</span>
        </div>

        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-tds-fg-primary leading-tight">
          나만의 모든 링크를 <br />
          <span className="text-tds-fg-brand">하나의 프로필</span>에 담아보세요
        </h1>

        <p className="text-[14px] sm:text-[15px] leading-relaxed text-tds-fg-secondary max-w-[360px]">
          Google 계정으로 로그인하면 나만의 개인화된 링크 페이지를 만들고 자유롭게 관리할 수 있습니다.
        </p>
      </section>

      {/* ── 2. 로그인 유도 메인 액션 버튼 ──────────────────── */}
      <section className="w-full max-w-[360px] flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full h-13 px-6 rounded-2xl bg-white border border-tds-line-default hover:border-tds-fg-brand hover:bg-tds-bg-secondary active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 text-[15px] font-semibold text-tds-fg-primary transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin text-tds-fg-brand" />
          ) : (
            <svg
              className="w-5 h-5 shrink-0"
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
          <span>Google로 계속하기</span>
          <ArrowRight className="w-4 h-4 text-tds-fg-tertiary ml-auto" />
        </button>

        <p className="flex items-center gap-1.5 text-[12px] text-tds-fg-placeholder">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>별도 회원가입 없이 간편하게 로그인할 수 있어요</span>
        </p>
      </section>

      {/* ── 3. 로그인 후 제공되는 기능 설명 카드 ───────────── */}
      <section className="w-full flex flex-col gap-3 pt-2">
        <h2 className="text-[13px] font-semibold text-tds-fg-tertiary px-1">
          로그인 후 이런 기능들을 사용할 수 있어요
        </h2>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-tds-line-default shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-tds-bg-brand-weak text-tds-fg-brand flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[15px] font-semibold text-tds-fg-primary">
                무제한 링크 등록 및 인라인 수정
              </h3>
              <p className="text-[13px] text-tds-fg-secondary leading-relaxed">
                블로그, 깃허브, 포트폴리오 링크를 클릭 한 번으로 추가하고 즉시 수정하세요.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-tds-line-default shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[15px] font-semibold text-tds-fg-primary">
                실시간 클라우드 동기화
              </h3>
              <p className="text-[13px] text-tds-fg-secondary leading-relaxed">
                Firestore 데이터베이스를 통해 로그인 계정별로 데이터가 안전하게 보관됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-tds-line-default shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[15px] font-semibold text-tds-fg-primary">
                토스 감성의 모바일 최적화 디자인
              </h3>
              <p className="text-[13px] text-tds-fg-secondary leading-relaxed">
                어떤 기기에서도 보기 편하고 반응이 빠른 인터페이스를 경험해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. 링크 미리보기 쇼케이스 ───────────────────────── */}
      <section className="w-full flex flex-col gap-3 pt-2">
        <h2 className="text-[13px] font-semibold text-tds-fg-tertiary px-1">
          미리보기 예시
        </h2>

        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-tds-line-default">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-tds-bg-secondary border border-tds-line-default">
            <span className="text-[20px]">⚡</span>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-tds-fg-primary">
                내 GitHub 저장소
              </span>
              <span className="text-[12px] text-tds-fg-tertiary">
                https://github.com/my-profile
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-tds-bg-secondary border border-tds-line-default">
            <span className="text-[20px]">📝</span>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-tds-fg-primary">
                기술 블로그 & 회고록
              </span>
              <span className="text-[12px] text-tds-fg-tertiary">
                https://velog.io/@my-blog
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
