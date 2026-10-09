"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BottomCtaProps {
  text: string;
  url?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * 화면 최하단 고정 CTA 버튼 컴포넌트
 * TDS 규격에 맞춰 상단 보호 그라디언트와 56px 높이의 브랜드 버튼을 제공합니다.
 */
export function BottomCta({ text, url, onClick, className }: BottomCtaProps) {
  if (!text) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex justify-center px-5 pb-6 pt-8 pointer-events-none bg-gradient-to-b from-transparent via-tds-bg-primary/70 to-tds-bg-primary",
        className
      )}
    >
      <a
        href={url || "mailto:contact@example.com"}
        onClick={onClick}
        className="tds-pressed pointer-events-auto w-full max-w-[480px] h-14 flex items-center justify-center text-[16px] font-semibold text-white bg-tds-bg-brand rounded-full shadow-md active:scale-[0.99] transition-all no-underline"
      >
        {text}
      </a>
    </div>
  );
}
