"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  onCopied?: () => void;
  className?: string;
  label?: string;
}

/**
 * 프로필 페이지 URL 공유 버튼 컴포넌트
 */
export function ShareButton({
  onCopied,
  className,
  label = "이 페이지 공유하기",
}: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      /* 클립보드 예외 무시 */
    }
    onCopied?.();
  };

  return (
    <button
      onClick={handleShare}
      type="button"
      className={cn(
        "tds-pressed inline-flex items-center gap-1.5 py-2 px-4 text-[14px] font-medium text-tds-fg-brand rounded-full hover:bg-tds-bg-secondary transition-colors border-none cursor-pointer select-none",
        className
      )}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {label}
    </button>
  );
}
