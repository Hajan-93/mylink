"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { linkFormSchema, normalizeUrl } from "@/lib/validations/link";
import { updateLinkInFirestore, deleteLinkFromFirestore } from "@/lib/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export interface LinkCardProps {
  id: string;
  title: string;
  url: string;
  desc?: string;
  emoji?: string;
  external?: boolean;
  className?: string;
  onDelete?: (id: string) => Promise<void> | void;
  onUpdate?: (id: string, updated: { title: string; url: string }) => Promise<void> | void;
}

const MAX_TITLE_LENGTH = 50;

/**
 * TDS 규격의 인라인 수정(검증 포함) 및 모달 확인 삭제 기능을 지원하는 링크 카드 컴포넌트
 */
export function LinkCard({
  id,
  title,
  url,
  desc,
  emoji = "🔗",
  external = true,
  className,
  onDelete,
  onUpdate,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editUrl, setEditUrl] = useState(url);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; url?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 삭제 확인 모달 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // props가 외부에서 변경될 때 편집 중이 아니면 상태 동기화
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(title);
      setEditUrl(url);
    }
  }, [title, url, isEditing]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(title);
    setEditUrl(url);
    setFieldErrors({});
    setSubmitError(null);
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      if (onDelete) {
        await onDelete(id);
      } else {
        await deleteLinkFromFirestore(id);
      }
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Firestore 링크 삭제 실패:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // 원래 값으로 복구 및 에러 초기화
    setEditTitle(title);
    setEditUrl(url);
    setFieldErrors({});
    setSubmitError(null);
    setIsEditing(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 추가할 때와 동일하게 linkFormSchema로 입력 검증
    const validationResult = linkFormSchema.safeParse({
      title: editTitle,
      url: editUrl,
    });

    if (!validationResult.success) {
      const errors: { title?: string; url?: string } = {};
      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as "title" | "url";
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    const validatedTitle = validationResult.data.title.trim();
    const normalized = normalizeUrl(validationResult.data.url);

    try {
      setIsSaving(true);
      setFieldErrors({});
      setSubmitError(null);

      if (onUpdate) {
        await onUpdate(id, { title: validatedTitle, url: normalized });
      } else {
        await updateLinkInFirestore(id, { title: validatedTitle, url: normalized });
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Firestore 링크 수정 실패:", err);
      setSubmitError("저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  /* ── 1. 인라인 편집 모드 (입력 검증 포함) ───────────────── */
  if (isEditing) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 p-4 bg-tds-bg-primary border-2 border-tds-bg-brand rounded-2xl shadow-tds-card transition-all animate-in fade-in duration-200",
          className
        )}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 flex items-center justify-center text-[16px] shrink-0 bg-tds-bg-secondary rounded-lg">
            {emoji}
          </div>
          <span className="text-[13px] font-semibold text-tds-fg-brand">
            링크 정보 수정
          </span>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3.5 mt-1" noValidate>
          {/* 1. 링크 제목 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`edit-title-${id}`}
                className="text-[13px] font-semibold text-tds-fg-secondary"
              >
                링크 제목 <span className="text-tds-fg-brand">*</span>
              </label>
              <span
                className={`text-[12px] tabular-nums ${
                  editTitle.length > MAX_TITLE_LENGTH
                    ? "text-tds-fg-danger font-semibold"
                    : "text-tds-fg-tertiary"
                }`}
              >
                {editTitle.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
            <Input
              id={`edit-title-${id}`}
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (fieldErrors.title) {
                  setFieldErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="예: 내 포트폴리오 사이트"
              disabled={isSaving}
              autoFocus
              className={`h-11 rounded-xl bg-tds-bg-secondary text-[14px] transition-colors ${
                fieldErrors.title
                  ? "border-tds-fg-danger ring-1 ring-tds-fg-danger/30 focus-visible:ring-tds-fg-danger"
                  : "border-tds-line-default focus-visible:ring-tds-bg-brand"
              }`}
            />
            {fieldErrors.title && (
              <p className="flex items-center gap-1 text-[12px] font-medium text-tds-fg-danger animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.title}</span>
              </p>
            )}
          </div>

          {/* 2. 링크 URL */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`edit-url-${id}`}
              className="text-[13px] font-semibold text-tds-fg-secondary"
            >
              URL 주소 <span className="text-tds-fg-brand">*</span>
            </label>
            <Input
              id={`edit-url-${id}`}
              type="text"
              value={editUrl}
              onChange={(e) => {
                setEditUrl(e.target.value);
                if (fieldErrors.url) {
                  setFieldErrors((prev) => ({ ...prev, url: undefined }));
                }
              }}
              placeholder="예: https://myportfolio.com 또는 github.com"
              disabled={isSaving}
              className={`h-11 rounded-xl bg-tds-bg-secondary text-[14px] transition-colors ${
                fieldErrors.url
                  ? "border-tds-fg-danger ring-1 ring-tds-fg-danger/30 focus-visible:ring-tds-fg-danger"
                  : "border-tds-line-default focus-visible:ring-tds-bg-brand"
              }`}
            />
            {fieldErrors.url && (
              <p className="flex items-center gap-1 text-[12px] font-medium text-tds-fg-danger animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.url}</span>
              </p>
            )}
          </div>

          {/* 저장 실패 에러 메시지 */}
          {submitError && (
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-tds-fg-danger animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{submitError}</span>
            </p>
          )}

          {/* 저장 및 취소 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-10 px-4 rounded-xl border border-tds-line-default text-[13px] font-medium text-tds-fg-secondary hover:bg-tds-bg-secondary transition-colors cursor-pointer disabled:opacity-50 select-none"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="tds-pressed h-10 px-5 rounded-xl bg-tds-bg-brand text-white text-[13px] font-semibold hover:bg-tds-bg-brand/90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 select-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <span>저장</span>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ── 2. 기본 보기 모드 (수정 & 삭제 버튼 포함) ─────────────── */
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3.5 p-3.5 sm:p-4 bg-tds-bg-primary border border-tds-line-default rounded-2xl shadow-tds-card hover:border-tds-line-strong transition-all relative group",
          className
        )}
      >
        {/* 좌측 이모지 아이콘 박스 */}
        <div className="w-10 h-10 flex items-center justify-center text-[20px] shrink-0 select-none bg-tds-bg-secondary rounded-[12px] group-hover:scale-105 transition-transform">
          {emoji}
        </div>

        {/* 중앙 타이틀 & 부가 설명 / URL 바로가기 링크 */}
        <a
          href={url}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="flex flex-col gap-0.5 min-w-0 flex-1 no-underline"
        >
          <span className="text-[15px] font-semibold text-tds-fg-primary truncate leading-snug group-hover:text-tds-fg-brand transition-colors">
            {title}
          </span>
          {desc ? (
            <span className="text-[13px] text-tds-fg-tertiary truncate leading-normal">
              {desc}
            </span>
          ) : (
            <span className="text-[12px] text-tds-fg-placeholder truncate leading-normal">
              {url}
            </span>
          )}
        </a>

        {/* 액션 영역: 수정 버튼, 삭제 버튼 & 우측 셰브론 */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleEditClick}
            title="이 링크 수정하기"
            aria-label={`${title} 링크 수정하기`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-tds-fg-secondary hover:text-tds-fg-brand hover:bg-tds-bg-brand-weak transition-colors cursor-pointer select-none"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDeleteClick}
            title="이 링크 삭제하기"
            aria-label={`${title} 링크 삭제하기`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-tds-fg-placeholder hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer select-none"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <a
            href={url}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={`${title} 바로가기`}
            className="p-1 text-tds-fg-disabled group-hover:text-tds-fg-secondary transition-colors"
          >
            <svg
              className="w-4 h-4 shrink-0"
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
        </div>
      </div>

      {/* ── 3. 삭제 확인 모달 다이얼로그 ─────────────────────── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6 bg-tds-bg-primary border border-tds-line-default shadow-xl">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-xl font-bold text-tds-fg-primary">
              정말 삭제하시겠습니까?
            </DialogTitle>
            <DialogDescription className="text-[14px] text-tds-fg-secondary leading-relaxed">
              &ldquo;{title}&rdquo; 링크가 삭제됩니다.
            </DialogDescription>
          </DialogHeader>

          {/* 경고 박스 */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-tds-fg-danger">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="text-[13px] font-medium text-red-600">
              이 작업은 되돌릴 수 없습니다.
            </span>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2 -mx-0 -mb-0 border-none bg-transparent">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className="h-11 px-4 rounded-xl text-tds-fg-secondary border-tds-line-default hover:bg-tds-bg-secondary select-none"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="tds-pressed h-11 px-5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all select-none"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>삭제 중...</span>
                </>
              ) : (
                <span>삭제하기</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
