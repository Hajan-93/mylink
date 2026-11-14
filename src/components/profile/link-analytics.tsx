"use client";

import React from "react";
import { ContentItem } from "@/types";
import { BarChart3, TrendingUp, MousePointerClick, ExternalLink } from "lucide-react";

interface LinkAnalyticsProps {
  contents: ContentItem[];
}

/**
 * 13주차 실습 컴포넌트: 마이페이지 통계 섹션
 * - 총 클릭수 합계 (큰 숫자로 강조)
 * - 링크별 클릭수 (많은 순 정렬, 프로그레스 바 시각화)
 */
export function LinkAnalytics({ contents }: LinkAnalyticsProps) {
  const links = contents.filter((item) => item.type === "link");
  const totalClicks = links.reduce((sum, item) => sum + (item.clickCount || 0), 0);

  // 클릭수가 많은 순으로 내림차순 정렬
  const sortedLinks = [...links].sort(
    (a, b) => (b.clickCount || 0) - (a.clickCount || 0)
  );

  const maxClick = Math.max(...links.map((l) => l.clickCount || 0), 1);

  return (
    <section className="flex flex-col gap-4 p-5 rounded-3xl bg-tds-bg-primary border border-tds-line-default shadow-sm">
      {/* ── 1. 통계 헤더 ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-tds-bg-brand-weak text-tds-fg-brand flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-tds-fg-primary">
              링크 클릭 통계
            </h2>
            <p className="text-[12px] text-tds-fg-secondary">
              방문자들이 내 링크를 클릭한 실시간 통계예요.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tds-fg-brand bg-tds-bg-brand-weak px-2.5 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          <span>실시간 집계</span>
        </span>
      </div>

      {/* ── 2. 총 클릭수 하이라이트 카드 ────────────────────── */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white shadow-xs text-tds-fg-brand flex items-center justify-center">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-tds-fg-secondary">총 누적 클릭수</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-tds-fg-primary tabular-nums tracking-tight">
                {totalClicks.toLocaleString()}
              </span>
              <span className="text-[14px] font-bold text-tds-fg-brand">클릭</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-tds-fg-tertiary">등록된 링크</span>
          <p className="text-[15px] font-bold text-tds-fg-secondary">
            {links.length}개
          </p>
        </div>
      </div>

      {/* ── 3. 링크별 클릭수 랭킹 및 진행 바 (많은 순 정렬) ────── */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between text-[12px] font-semibold text-tds-fg-tertiary px-1">
          <span>링크별 인기 순위</span>
          <span>클릭수</span>
        </div>

        {sortedLinks.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-tds-fg-tertiary">
            등록된 링크가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {sortedLinks.map((link, idx) => {
              const count = link.clickCount || 0;
              const percentage = Math.round((count / maxClick) * 100);

              return (
                <div
                  key={link.id}
                  className="flex flex-col gap-1.5 p-3 rounded-2xl bg-tds-bg-secondary border border-tds-line-default hover:border-tds-fg-brand/30 transition-colors"
                >
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          idx === 0
                            ? "bg-amber-100 text-amber-800"
                            : idx === 1
                            ? "bg-slate-200 text-slate-700"
                            : idx === 2
                            ? "bg-amber-700/10 text-amber-900"
                            : "bg-tds-bg-primary text-tds-fg-tertiary"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[14px] select-none">{link.emoji || "🔗"}</span>
                      <span className="font-bold text-tds-fg-primary truncate">
                        {link.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 font-bold tabular-nums text-tds-fg-primary">
                      <span className="text-[14px] text-tds-fg-brand">{count.toLocaleString()}</span>
                      <span className="text-[11px] text-tds-fg-tertiary font-normal">회</span>
                    </div>
                  </div>

                  {/* 프로그레스 바 시각화 */}
                  <div className="w-full h-2 rounded-full bg-tds-bg-primary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                      style={{
                        width: `${count > 0 ? Math.max(percentage, 4) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
