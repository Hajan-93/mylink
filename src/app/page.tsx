"use client";

import Image from "next/image";
import { useState } from "react";

interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: (props: { className?: string }) => React.ReactNode;
  badge?: string;
  highlight?: boolean;
}

const SKILL_TAGS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
  "Git & GitHub",
  "Figma",
];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const links: LinkItem[] = [
    {
      id: "github",
      title: "GitHub 저장소",
      description: "매일 성장하는 잔디 커밋과 프로젝트 소스 코드",
      url: "https://github.com",
      highlight: true,
      badge: "Active",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
    },
    {
      id: "blog",
      title: "기술 및 학습 블로그",
      description: "새롭게 배운 기술과 에러 트러블슈팅 정리",
      url: "https://velog.io",
      badge: "Blog",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="M6 14h6" />
        </svg>
      ),
    },
    {
      id: "projects",
      title: "프로젝트 & 포트폴리오",
      description: "직접 구현해 본 웹 서비스와 인터랙티브 토이 프로젝트 모음",
      url: "#",
      badge: "Works",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      id: "email",
      title: "이메일 보내기",
      description: "협업 제안, 커피챗, 질문 등 언제든 환영합니다",
      url: "mailto:contact@example.com",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col items-center justify-between px-4 py-8 sm:py-14 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Gradient Blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-80 h-80 bg-emerald-400/15 dark:bg-emerald-600/10 rounded-full blur-3xl" />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between mb-8 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open to Connect & Learn</span>
          </div>

          <button
            onClick={handleShare}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs backdrop-blur-sm transition-all active:scale-95 cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            title="프로필 링크 복사하기"
            type="button"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            <span>공유하기</span>
          </button>
        </div>

        {/* Toast Notification */}
        {copied && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 dark:bg-white/90 text-white dark:text-zinc-900 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 border border-zinc-700 dark:border-zinc-200">
            <span>✨</span>
            <span>프로필 링크가 클립보드에 복사되었습니다!</span>
          </div>
        )}

        {/* Profile Card / Header */}
        <section className="w-full text-center flex flex-col items-center mb-8">
          {/* Avatar with Gradient Ring */}
          <div className="relative mb-5 group">
            <div className="p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white dark:bg-zinc-800">
                <Image
                  src="/profile.svg"
                  alt="전하진 프로필 아바타"
                  fill
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Status Indicator Icon Badge */}
            <div
              className="absolute bottom-1 right-1 bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-md border border-zinc-100 dark:border-zinc-800 text-base"
              title="열심히 코딩 중 🌱"
            >
              <span className="block leading-none">🌱</span>
            </div>
          </div>

          {/* Name & Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-1.5 flex items-center justify-center gap-2">
            <span>전하진</span>
            <span className="text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
              Junior Dev
            </span>
          </h1>

          <p className="text-sm sm:text-base font-medium text-indigo-600 dark:text-indigo-400 mb-3">
            Frontend & Web Developer
          </p>

          {/* Bio Quote */}
          <div className="max-w-md px-4 py-3 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xs shadow-xs mb-5">
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              안녕하세요! 매일 한 줄의 코드로 성장해 나가는 초보 개발자입니다. 🌱<br className="hidden sm:inline" />
              새로운 기술을 탐구하고, 직접 만들어가는 즐거움을 알아가고 있어요.
            </p>
          </div>

          {/* Skill Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-sm sm:max-w-md">
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 font-medium transition-colors hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>

        {/* Quick Social Buttons */}
        <section className="w-full flex items-center justify-center gap-3 mb-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-500 hover:-translate-y-0.5 transition-all text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white"
            aria-label="GitHub 프로필"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <a
            href="mailto:contact@example.com"
            className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-500 hover:-translate-y-0.5 transition-all text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            aria-label="이메일 문의"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>

          <a
            href="https://velog.io"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-500 hover:-translate-y-0.5 transition-all text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400"
            aria-label="기술 블로그"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
              <path d="M6 14h6" />
            </svg>
          </a>
        </section>

        {/* Links List (My-Link Cards) */}
        <section className="w-full flex flex-col gap-3.5 mb-10">
          <div className="flex items-center justify-between px-1 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Links & Activity
            </h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {links.length} Links
            </span>
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 active:scale-[0.99] cursor-pointer ${
                  link.highlight
                    ? "bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-zinc-900 border-indigo-200 dark:border-indigo-800/70 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600"
                    : "bg-white/85 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
                } backdrop-blur-sm hover:-translate-y-0.5`}
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div
                    className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      link.highlight
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {link.title}
                      </h3>
                      {link.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {link.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </a>
            );
          })}
        </section>

        {/* Highlights / About Me Micro-Grid */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xs text-center sm:text-left flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
            <span className="text-xl sm:text-2xl p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200/50 dark:border-amber-800/40">
              💡
            </span>
            <div>
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Focus
              </div>
              <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                웹 프론트엔드 & UX
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xs text-center sm:text-left flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
            <span className="text-xl sm:text-2xl p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/40">
              🌱
            </span>
            <div>
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Currently
              </div>
              <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                Next.js & TypeScript
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xs text-center sm:text-left flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
            <span className="text-xl sm:text-2xl p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border border-indigo-200/50 dark:border-indigo-800/40">
              🎯
            </span>
            <div>
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Goal
              </div>
              <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                사용자 중심 서비스 제작
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-zinc-400 dark:text-zinc-500 py-4 border-t border-zinc-200/60 dark:border-zinc-800/60 mt-auto">
        <p>© 2026 전하진 • My-Link Profile</p>
        <p className="mt-1 text-[11px] text-zinc-400/80">
          Crafted with Next.js & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

