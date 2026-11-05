"use client";

import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/auth-context";
import { getUserProfileFromFirestore, syncUserProfileToFirestore } from "@/lib/firestore";
import { ProfileData } from "@/types";
import { Loader2, AlertCircle, UserCheck } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (profile: ProfileData) => void;
}

const MAX_NAME_LENGTH = 30;
const MAX_HEADLINE_LENGTH = 50;
const MAX_BIO_LENGTH = 150;

export function EditProfileDialog({
  open,
  onOpenChange,
  onSuccess,
}: EditProfileDialogProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 열릴 때 기존 프로필 정보 로드
  useEffect(() => {
    async function loadCurrentProfile() {
      if (!user?.uid || !open) return;
      try {
        setIsLoading(true);
        setError(null);
        const profile = await getUserProfileFromFirestore(user.uid);
        if (profile) {
          setName(profile.name || user.displayName || "");
          setHeadline(profile.headline || "");
          setBio(profile.bio || "");
        } else {
          setName(user.displayName || "사용자");
          setHeadline("");
          setBio("");
        }
      } catch (err) {
        console.error("프로필 정보 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentProfile();
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("닉네임(이름)을 1자 이상 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const updated = await syncUserProfileToFirestore(user.uid, {
        name: trimmedName,
        headline: headline.trim(),
        bio: bio.trim(),
        avatarUrl: user.photoURL || "/profile.svg",
      });

      if (onSuccess) {
        onSuccess(updated);
      }

      // 페이지 전체에 프로필 업데이트 이벤트 전파
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("mylink-profile-updated", { detail: updated })
        );
      }

      onOpenChange(false);
    } catch (err) {
      console.error("프로필 정보 저장 실패:", err);
      setError("프로필 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-3xl p-6 bg-tds-bg-primary border border-tds-line-default shadow-xl">
        <DialogHeader className="gap-1.5 text-left">
          <DialogTitle className="text-xl font-bold tracking-tight text-tds-fg-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-tds-bg-brand-weak text-tds-fg-brand flex items-center justify-center text-[16px]">
              ✏️
            </span>
            <span>프로필 수정</span>
          </DialogTitle>
          <DialogDescription className="text-[13px] text-tds-fg-secondary">
            프로필에 노출될 닉네임과 소개글을 설정해요.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-tds-fg-tertiary">
            <Loader2 className="w-6 h-6 animate-spin text-tds-fg-brand" />
            <span className="text-[13px]">프로필 정보를 불러오는 중...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-[13px] border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. 닉네임 / 이름 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-profile-name"
                  className="text-[13px] font-semibold text-tds-fg-secondary"
                >
                  닉네임 (이름) <span className="text-tds-fg-brand">*</span>
                </label>
                <span className="text-[11px] text-tds-fg-tertiary tabular-nums">
                  {name.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
              <Input
                id="edit-profile-name"
                type="text"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="예: 홍길동"
                disabled={isSaving}
                className="h-11 rounded-xl bg-tds-bg-secondary text-[14px] border-tds-line-default focus-visible:ring-tds-bg-brand"
              />
            </div>

            {/* 2. 직무 / 한 줄 소개 (헤드라인) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-profile-headline"
                  className="text-[13px] font-semibold text-tds-fg-secondary"
                >
                  직무 / 헤드라인
                </label>
                <span className="text-[11px] text-tds-fg-tertiary tabular-nums">
                  {headline.length}/{MAX_HEADLINE_LENGTH}
                </span>
              </div>
              <Input
                id="edit-profile-headline"
                type="text"
                value={headline}
                maxLength={MAX_HEADLINE_LENGTH}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="예: 주니어 프론트엔드 개발자 · 광운대"
                disabled={isSaving}
                className="h-11 rounded-xl bg-tds-bg-secondary text-[14px] border-tds-line-default focus-visible:ring-tds-bg-brand"
              />
            </div>

            {/* 3. 소개글 (Bio) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-profile-bio"
                  className="text-[13px] font-semibold text-tds-fg-secondary"
                >
                  자기소개 (Bio)
                </label>
                <span className="text-[11px] text-tds-fg-tertiary tabular-nums">
                  {bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <textarea
                id="edit-profile-bio"
                rows={3}
                value={bio}
                maxLength={MAX_BIO_LENGTH}
                onChange={(e) => setBio(e.target.value)}
                placeholder="자신을 소개하는 짧은 글을 적어보세요."
                disabled={isSaving}
                className="w-full p-3 rounded-xl bg-tds-bg-secondary text-[14px] text-tds-fg-primary border border-tds-line-default focus:outline-none focus:ring-2 focus:ring-tds-bg-brand resize-none"
              />
            </div>

            <DialogFooter className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="h-11 px-4 rounded-xl border-tds-line-default hover:bg-tds-bg-secondary text-[14px] font-semibold"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 px-5 rounded-xl bg-tds-bg-brand hover:bg-tds-bg-brand/90 text-white text-[14px] font-semibold flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>저장하기</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
