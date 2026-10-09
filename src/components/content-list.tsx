"use client";

import React from "react";
import { ContentItem } from "@/types";
import { LinkCard, SectionHeader } from "./profile";

interface ContentListProps {
  contents: ContentItem[];
}

/**
 * 정렬된 통합 콘텐츠(섹션 및 링크 카드) 목록 렌더링 컴포넌트
 */
export function ContentList({ contents }: ContentListProps) {
  if (!contents || contents.length === 0) {
    return (
      <div className="py-12 text-center text-[14px] text-tds-fg-tertiary">
        등록된 링크가 아직 없어요.
      </div>
    );
  }

  // order 기준 오름차순 정렬
  const sorted = [...contents].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-2.5">
      {sorted.map((item, index) => {
        if (item.type === "section") {
          return (
            <SectionHeader
              key={item.id || `sec-${index}`}
              title={item.title}
              isFirst={index === 0}
            />
          );
        }

        // type === "link"
        return (
          <LinkCard
            key={item.id || `lnk-${index}`}
            id={item.id}
            title={item.title}
            url={item.url || "#"}
            desc={item.desc}
            emoji={item.emoji}
            external={true}
          />
        );
      })}
    </div>
  );
}
