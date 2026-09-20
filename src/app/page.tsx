"use client";

import Image from "next/image";
import { useState } from "react";

// ── 링크 데이터 ────────────────────────────────────────────────
const links = [
  {
    id: "github",
    emoji: "⚡",
    label: "GitHub",
    desc: "코드 저장소 · 오픈소스 기여",
    url: "https://github.com",
    external: true,
  },
  {
    id: "blog",
    emoji: "📝",
    label: "기술 블로그",
    desc: "학습 기록 · 트러블슈팅 로그",
    url: "https://velog.io",
    external: true,
  },
  {
    id: "portfolio",
    emoji: "🎨",
    label: "포트폴리오",
    desc: "직접 만든 프로젝트들을 모아뒀어요",
    url: "#",
    external: false,
  },
  {
    id: "email",
    emoji: "✉️",
    label: "이메일로 연락하기",
    desc: "커피챗 · 협업 제안 환영해요",
    url: "mailto:contact@example.com",
    external: false,
  },
];

// ── 스킬 태그 ─────────────────────────────────────────────────
const skills = [
  "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Node.js", "Git", "Figma", "SQL",
];

// ── 하이라이트 카드 ───────────────────────────────────────────
const highlights = [
  { emoji: "🚀", value: "100+", label: "커밋", sub: "이번 달" },
  { emoji: "🌱", value: "1,024일", label: "성장 중", sub: "매일 코딩" },
  { emoji: "☕", value: "∞", label: "커피챗", sub: "항상 열려있어요" },
];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      /* fallback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* ── Toast ────────────────────────────────────────── */}
      {copied && (
        <div
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-[14px] text-sm font-semibold text-white"
          style={{ background: "var(--tds-fg-primary)", boxShadow: "var(--tds-shadow-toast)" }}
        >
          <span>🔗</span>
          <span>링크를 복사했어요!</span>
        </div>
      )}

      {/* ── Page Shell ───────────────────────────────────── */}
      <div
        className="min-h-screen flex flex-col items-center pb-32"
        style={{ background: "var(--tds-bg-primary)" }}
      >
        <main className="w-full max-w-[480px] px-5 flex flex-col gap-0">

          {/* ── 1. 프로필 섹션 ────────────────────────────── */}
          <section className="flex flex-col items-center pt-14 pb-8 gap-4">
            <div
              className="relative w-[88px] h-[88px] rounded-full overflow-hidden shrink-0"
              style={{ border: "3px solid var(--tds-line-default)" }}
            >
              <Image
                src="/profile.svg"
                alt="전하진 프로필 이미지"
                fill
                sizes="88px"
                className="object-cover"
                priority
              />
            </div>

            <div className="text-center flex flex-col gap-1">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--tds-fg-primary)" }}
              >
                전하진
              </h1>
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--tds-fg-secondary)" }}
              >
                주니어 프론트엔드 개발자 · 광운대학교
              </p>
              <p
                className="text-[13px]"
                style={{ color: "var(--tds-fg-tertiary)" }}
              >
                매일 한 줄씩 성장하고 있어요 🌱
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="tds-pressed inline-flex items-center h-[34px] px-3 text-[13px] font-medium select-none cursor-default"
                  style={{
                    border: "1px solid var(--tds-line-default)",
                    color: "var(--tds-fg-secondary)",
                    background: "var(--tds-bg-primary)",
                    borderRadius: "var(--tds-radius-full)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* ── 2. 하이라이트 stats ───────────────────────── */}
          <section
            className="p-4 flex items-stretch mb-6"
            style={{
              background: "var(--tds-bg-secondary)",
              borderRadius: "var(--tds-radius-xl)",
            }}
          >
            {highlights.map((h, i) => (
              <div
                key={h.label}
                className="flex-1 flex flex-col items-center gap-0.5 py-2"
                style={{
                  borderRight:
                    i < highlights.length - 1
                      ? "1px solid var(--tds-line-default)"
                      : "none",
                }}
              >
                <span className="text-xl">{h.emoji}</span>
                <span
                  className="text-[18px] font-bold tabular-nums"
                  style={{ color: "var(--tds-fg-primary)" }}
                >
                  {h.value}
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "var(--tds-fg-secondary)" }}
                >
                  {h.label}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "var(--tds-fg-tertiary)" }}
                >
                  {h.sub}
                </span>
              </div>
            ))}
          </section>

          {/* ── 3. 소개 ─────────────────────────────────── */}
          <section className="mb-6 px-1">
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: "var(--tds-fg-secondary)" }}
            >
              안녕하세요! 새로운 기술 탐구와 직접 만드는 즐거움을 좋아하는
              개발자예요. 함께 성장해요 🌱
            </p>
          </section>

          {/* ── 4. 링크 카드 ─────────────────────────────── */}
          <section className="flex flex-col gap-3 mb-6">
            <h2
              className="text-[13px] font-semibold px-1 mb-1"
              style={{ color: "var(--tds-fg-tertiary)" }}
            >
              링크
            </h2>
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="tds-pressed flex items-center gap-4 p-4"
                style={{
                  background: "var(--tds-bg-primary)",
                  border: "1px solid var(--tds-line-default)",
                  borderRadius: "var(--tds-radius-xl)",
                  boxShadow: "var(--tds-shadow-card)",
                  textDecoration: "none",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: "var(--tds-bg-secondary)",
                    borderRadius: "var(--tds-radius-m)",
                  }}
                >
                  {link.emoji}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: "var(--tds-fg-primary)" }}
                  >
                    {link.label}
                  </span>
                  <span
                    className="text-[13px] truncate"
                    style={{ color: "var(--tds-fg-tertiary)" }}
                  >
                    {link.desc}
                  </span>
                </div>

                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--tds-fg-disabled)" }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            ))}
          </section>

          {/* ── 5. 공유 ghost 버튼 ───────────────────────── */}
          <section className="flex justify-center mb-10">
            <button
              onClick={handleShare}
              type="button"
              className="tds-pressed inline-flex items-center gap-1.5 text-[14px] font-medium"
              style={{
                color: "var(--tds-fg-brand)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              이 페이지 공유하기
            </button>
          </section>

          {/* ── 6. 푸터 ─────────────────────────────────── */}
          <footer className="flex flex-col items-center gap-1 pb-4">
            <p className="text-[12px]" style={{ color: "var(--tds-fg-placeholder)" }}>
              © 2026 전하진
            </p>
            <p className="text-[12px]" style={{ color: "var(--tds-fg-placeholder)" }}>
              Built with Next.js · Toss Design System
            </p>
          </footer>
        </main>
      </div>

      {/* ── Bottom CTA (고정) ─────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-5 pb-6"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--tds-bg-primary) 40%)",
          paddingTop: "24px",
        }}
      >
        <a
          href="mailto:contact@example.com"
          className="tds-pressed w-full h-14 flex items-center justify-center text-[16px] font-semibold text-white"
          style={{
            background: "var(--tds-bg-brand)",
            borderRadius: "var(--tds-radius-full)",
            maxWidth: "480px",
            textDecoration: "none",
          }}
        >
          커피챗 신청하기 ☕
        </a>
      </div>
    </>
  );
}