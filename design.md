---
name: 토스
slug: toss
category: finance
last_updated: "2026-08-22"
created_at: "2026-05-11"
lang: ko
---

# Toss Design System (TDS) — 핵심 스펙 요약

## 색상 토큰
- blue-500: oklch(0.624 0.176 254) — primary CTA
- grey-900: oklch(0.234 0.030 254) — text-primary
- grey-700: oklch(0.452 0.028 253) — text-secondary
- grey-500: oklch(0.590 0.022 255) — text-tertiary
- grey-200: oklch(0.913 0.008 247) — border-default
- white: oklch(1.000 0.000 0) — bg-primary
- grey-100: oklch(0.957 0.005 247) — bg-secondary

## 타이포그래피
- 폰트: Pretendard Variable
- body-2: 15px / 400 / 1.5lh
- caption: 12px

## 버튼 사이즈
- XL: h-56 / radius-full(999px) — 주 CTA
- L: h-48 / radius-l(14px)
- M: h-40 / radius-m(12px)
- S: h-32 / radius-s(10px)

## 인터랙션
- pressed: oklch(0.000 0.000 0 / 0.26) overlay
- motion ease: cubic-bezier(0.22, 0.61, 0.36, 1)
- duration: 120ms / 200ms / 320ms

## Bottom CTA
- 화면 최하단 고정 56pt
- 위에 white→transparent 보호 그라디언트

## 카피라이팅
- 해요체(-요) 사용
- 단정형(-다) 금지
- "Navigating error" 원칙

## 금지 사항
- 그라디언트 3가지 예외 외 금지 (bottom CTA 보호, 로딩 glow, 일러스트)
- 바운스/shimmer 애니메이션 금지
- 다크 배경 원칙적 금지
