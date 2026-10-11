"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentItem } from "@/types";
import { AlertCircle, Plus } from "lucide-react";
import {
  LinkFormValues,
  linkFormSchema,
  normalizeUrl,
} from "@/lib/validations/link";
import { generateLinkId } from "@/lib/utils";

interface AddLinkDialogProps {
  onAddLink: (newLink: Omit<ContentItem, "order">) => void;
  trigger?: React.ReactNode;
}

const EMOJI_PRESETS = ["🔗", "⚡", "📝", "📄", "🎨", "💡", "☕", "🚀", "💻", "✨"];
const MAX_TITLE_LENGTH = 50;
const MAX_DESC_LENGTH = 100;

/**
 * Zod + react-hook-form 기반의 새로운 링크 등록 모달 다이얼로그 컴포넌트
 */
export function AddLinkDialog({ onAddLink, trigger }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      title: "",
      url: "",
      desc: "",
      emoji: "🔗",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const currentEmoji = useWatch({ control, name: "emoji" }) || "🔗";
  const currentTitle = useWatch({ control, name: "title" }) || "";
  const currentDesc = useWatch({ control, name: "desc" }) || "";

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  const onSubmit = (data: LinkFormValues) => {
    const normalized = normalizeUrl(data.url);

    const newLink: Omit<ContentItem, "order"> = {
      id: generateLinkId(),
      type: "link",
      title: data.title.trim(),
      url: normalized,
      desc: data.desc?.trim() || undefined,
      emoji: data.emoji || "🔗",
    };

    onAddLink(newLink);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="contents cursor-pointer">
          {trigger}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="tds-pressed flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-tds-bg-secondary text-tds-fg-primary text-[15px] font-semibold rounded-2xl border border-dashed border-tds-line-strong hover:bg-tds-bg-tertiary transition-colors cursor-pointer select-none"
        >
          <Plus className="w-4 h-4 text-tds-fg-brand" />
          <span>새 링크 추가하기</span>
        </button>
      )}

      <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 bg-tds-bg-primary border border-tds-line-default shadow-xl">
        <DialogHeader className="gap-1.5 text-left">
          <DialogTitle className="text-xl font-bold text-tds-fg-primary">
            새 링크 추가하기
          </DialogTitle>
          <DialogDescription className="text-[13px] text-tds-fg-secondary">
            프로필 페이지에 노출될 새로운 링크 정보를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2" noValidate>
          {/* 1. 이모지 아이콘 선택 */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-tds-fg-secondary">
              아이콘
            </label>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center text-2xl bg-tds-bg-secondary border border-tds-line-default rounded-xl shrink-0 select-none">
                {currentEmoji}
              </div>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {EMOJI_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setValue("emoji", preset)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-base transition-colors ${
                      currentEmoji === preset
                        ? "bg-tds-bg-brand-weak ring-2 ring-tds-bg-brand"
                        : "bg-tds-bg-secondary hover:bg-tds-bg-tertiary"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. 링크 제목 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="link-title"
                className="text-[13px] font-semibold text-tds-fg-secondary"
              >
                링크 제목 <span className="text-tds-fg-brand">*</span>
              </label>
              <span
                className={`text-[12px] tabular-nums ${
                  currentTitle.length > MAX_TITLE_LENGTH
                    ? "text-tds-fg-danger font-semibold"
                    : "text-tds-fg-tertiary"
                }`}
              >
                {currentTitle.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
            <Input
              id="link-title"
              placeholder="예: 내 포트폴리오 사이트"
              {...register("title", {
                onChange: () => {
                  if (errors.title) clearErrors("title");
                },
              })}
              className={`h-11 rounded-xl bg-tds-bg-secondary text-[14px] transition-colors ${
                errors.title
                  ? "border-tds-fg-danger ring-1 ring-tds-fg-danger/30 focus-visible:ring-tds-fg-danger"
                  : "border-tds-line-default focus-visible:ring-tds-bg-brand"
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-[12px] font-medium text-tds-fg-danger animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* 3. 링크 URL */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="link-url"
              className="text-[13px] font-semibold text-tds-fg-secondary"
            >
              URL 주소 <span className="text-tds-fg-brand">*</span>
            </label>
            <Input
              id="link-url"
              placeholder="예: https://myportfolio.com 또는 github.com"
              {...register("url", {
                onChange: () => {
                  if (errors.url) clearErrors("url");
                },
              })}
              className={`h-11 rounded-xl bg-tds-bg-secondary text-[14px] transition-colors ${
                errors.url
                  ? "border-tds-fg-danger ring-1 ring-tds-fg-danger/30 focus-visible:ring-tds-fg-danger"
                  : "border-tds-line-default focus-visible:ring-tds-bg-brand"
              }`}
            />
            {errors.url && (
              <p className="flex items-center gap-1 text-[12px] font-medium text-tds-fg-danger animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.url.message}</span>
              </p>
            )}
          </div>

          {/* 4. 부가 설명 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="link-desc"
                className="text-[13px] font-semibold text-tds-fg-secondary"
              >
                상세 설명 (선택)
              </label>
              <span
                className={`text-[12px] tabular-nums ${
                  currentDesc.length > MAX_DESC_LENGTH
                    ? "text-tds-fg-danger font-semibold"
                    : "text-tds-fg-tertiary"
                }`}
              >
                {currentDesc.length}/{MAX_DESC_LENGTH}
              </span>
            </div>
            <Input
              id="link-desc"
              placeholder="예: 최근 진행한 프로젝트와 이력서 모아보기"
              {...register("desc", {
                onChange: () => {
                  if (errors.desc) clearErrors("desc");
                },
              })}
              className={`h-11 rounded-xl bg-tds-bg-secondary text-[14px] transition-colors ${
                errors.desc
                  ? "border-tds-fg-danger ring-1 ring-tds-fg-danger/30 focus-visible:ring-tds-fg-danger"
                  : "border-tds-line-default focus-visible:ring-tds-bg-brand"
              }`}
            />
            {errors.desc && (
              <p className="flex items-center gap-1 text-[12px] font-medium text-tds-fg-danger animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.desc.message}</span>
              </p>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2 -mx-0 -mb-0 border-none bg-transparent">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 px-4 rounded-xl text-tds-fg-secondary border-tds-line-default hover:bg-tds-bg-secondary"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="tds-pressed h-11 px-5 rounded-xl bg-tds-bg-brand text-white hover:bg-tds-bg-brand/90 font-semibold"
            >
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
