import { z } from "zod";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * URL에 프로토콜(http/https/mailto)이 없는 경우 https://를 자동으로 보정하여 정규화합니다.
 */
export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("mailto:")) {
    return trimmed;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Zod 기반 링크 추가 폼 검증 스키마
 */
export const linkFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "링크 제목을 입력해 주세요." })
    .max(50, { message: "링크 제목은 50자 이내로 입력해 주세요." }),
  url: z
    .string()
    .trim()
    .min(1, { message: "URL 주소를 입력해 주세요." })
    .superRefine((val, ctx) => {
      const trimmed = val.trim();
      if (!trimmed) return;

      // 1. 이메일 (mailto:) 지원 검증
      if (trimmed.startsWith("mailto:")) {
        const email = trimmed.slice(7).trim();
        if (!email || !EMAIL_REGEX.test(email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "올바른 이메일 주소(예: mailto:name@example.com)를 입력해 주세요.",
          });
        }
        return;
      }

      // 2. 웹 URL 프로토콜 보정 및 검증
      const withProtocol = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;

      try {
        const parsed = new URL(withProtocol);
        const hostname = parsed.hostname;

        // localhost는 로컬 개발을 위해 허용
        if (hostname === "localhost") {
          return;
        }

        // 도메인 형식 검사 (최소 하나의 점 포함 및 유효한 영문 TLD 2자 이상 확인)
        const domainParts = hostname.split(".");
        const tld = domainParts[domainParts.length - 1];

        if (
          domainParts.length < 2 ||
          !tld ||
          !/^[a-zA-Z]{2,}$/.test(tld) ||
          domainParts.some((part) => !part)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "도메인 이름(예: github.com, velog.io)을 정확히 입력해 주세요.",
          });
          return;
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "올바른 URL 형식(예: https://example.com)을 입력해 주세요.",
        });
      }
    }),
  desc: z
    .string()
    .trim()
    .max(100, { message: "상세 설명은 100자 이내로 입력해 주세요." })
    .optional(),
  emoji: z.string().optional(),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;
