"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LinkCardProps {
  id: string;
  title: string;
  url: string;
  desc?: string;
  emoji?: string;
  external?: boolean;
  className?: string;
}

/**
 * TDS 규격의 재사용 가능한 단일 링크 카드 컴포넌트
 */
export function LinkCard({
  title,
  url,
  desc,
  emoji = "🔗",
  external = true,
  className,
}: LinkCardProps) {
  return (
    <a
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "tds-pressed flex items-center gap-3.5 p-3.5 sm:p-4 bg-tds-bg-primary border border-tds-line-default rounded-2xl shadow-tds-card hover:border-tds-line-strong transition-all no-underline group",
        className
      )}
    >
      {/* 좌측 이모지 아이콘 박스 */}
      <div className="w-10 h-10 flex items-center justify-center text-[20px] shrink-0 select-none bg-tds-bg-secondary rounded-[12px] group-hover:scale-105 transition-transform">
        {emoji}
      </div>

      {/* 중앙 타이틀 & 부가 설명 */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[15px] font-semibold text-tds-fg-primary truncate leading-snug">
          {title}
        </span>
        {desc && (
          <span className="text-[13px] text-tds-fg-tertiary truncate leading-normal">
            {desc}
          </span>
        )}
      </div>

      {/* 우측 셰브론 아이콘 */}
      <svg
        className="w-4 h-4 shrink-0 text-tds-fg-disabled group-hover:text-tds-fg-secondary transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </a>
  );
}
