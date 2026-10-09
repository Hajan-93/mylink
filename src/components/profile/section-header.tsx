import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  isFirst?: boolean;
  className?: string;
}

/**
 * 콘텐츠 그룹 구분을 위한 섹션 헤더 컴포넌트
 */
export function SectionHeader({
  title,
  isFirst = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "px-1 text-[13px] font-semibold text-tds-fg-tertiary select-none",
        isFirst ? "pt-2 pb-1" : "pt-6 pb-1",
        className
      )}
    >
      {title}
    </div>
  );
}
