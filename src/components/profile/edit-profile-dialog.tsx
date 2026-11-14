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
import {
  getUserProfileFromFirestore,
  syncUserProfileToFirestore,
  checkUsernameAvailability,
  generateDefaultUsername,
} from "@/lib/firestore";
import { ProfileData } from "@/types";
import { Loader2, AlertCircle, UserCheck, CheckCircle2 } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (profile: ProfileData) => void;
}

const MAX_NAME_LENGTH = 30;
const MAX_HEADLINE_LENGTH = 50;
const MAX_BIO_LENGTH = 150;
const MAX_USERNAME_LENGTH = 20;

export function EditProfileDialog({
  open,
  onOpenChange,
  onSuccess,
}: EditProfileDialogProps) {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<string | null>(null);

  // 모달이 열릴 때 기존 프로필 정보 로드
  useEffect(() => {
    async function loadCurrentProfile() {
      if (!user?.uid || !open) return;
      try {
        setIsLoading(true);
        setError(null);
        setUsernameStatus(null);
        const profile = await getUserProfileFromFirestore(user.uid);
        if (profile) {
          const loadedUsername = profile.username || generateDefaultUsername(user.email || user.displayName);
          setUsername(loadedUsername);
          setOriginalUsername(profile.username || "");
          setName(profile.displayName || profile.name || user.displayName || "");
          setHeadline(profile.headline || "");
          setBio(profile.bio || "");
        } else {
          const defaultUsername = generateDefaultUsername(user.email || user.displayName);
          setUsername(defaultUsername);
          setOriginalUsername("");
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

  const handleCheckUsername = async () => {
    if (!username.trim()) {
      setError("username을 입력해주세요.");
      return;
    }
    setError(null);
    const result = await checkUsernameAvailability(username, user?.uid);
    if (!result.available) {
      setError(result.error || "이미 사용 중인 username입니다.");
      setUsernameStatus(null);
    } else {
      setUsernameStatus("사용 가능한 아이디(username)입니다! ✨");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedUsername) {
      setError("공유 URL용 username을 3자 이상 입력해주세요.");
      return;
    }

    if (!trimmedName) {
      setError("표시될 닉네임(이름)을 1자 이상 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // 12주차: username 저장 전 중복 체크
      if (trimmedUsername !== originalUsername) {
        const checkResult = await checkUsernameAvailability(trimmedUsername, user.uid);
        if (!checkResult.available) {
          setError(checkResult.error || "이미 사용 중인 username입니다. 다른 이름을 선택해주세요.");
          setIsSaving(false);
          return;
        }
      }

      const updated = await syncUserProfileToFirestore(user.uid, {
        username: trimmedUsername,
        displayName: trimmedName,
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
    } catch (err: unknown) {
      console.error("프로필 정보 저장 실패:", err);
      const errMsg = err instanceof Error ? err.message : "프로필 저장 중 오류가 발생했습니다.";
      setError(errMsg);
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

            {usernameStatus && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-emerald-700 text-[13px] border border-green-100">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{usernameStatus}</span>
              </div>
            )}

            {/* 1. 공유 URL용 고유 사용자명 (12주차 핵심) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-profile-username"
                  className="text-[13px] font-semibold text-tds-fg-secondary"
                >
                  공유 URL 아이디 (username) <span className="text-tds-fg-brand">*</span>
                </label>
                <span className="text-[11px] text-tds-fg-tertiary tabular-nums">
                  {username.length}/{MAX_USERNAME_LENGTH}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-tds-fg-tertiary select-none">
                    /
                  </span>
                  <Input
                    id="edit-profile-username"
                    type="text"
                    value={username}
                    maxLength={MAX_USERNAME_LENGTH}
                    onChange={(e) => {
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
                      if (error) setError(null);
                      if (usernameStatus) setUsernameStatus(null);
                    }}
                    placeholder="honggildong"
                    disabled={isSaving}
                    className="h-11 pl-6 rounded-xl bg-tds-bg-secondary text-[14px] border-tds-line-default focus-visible:ring-tds-bg-brand"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCheckUsername}
                  disabled={isSaving || !username.trim()}
                  className="h-11 px-3 text-[13px] rounded-xl border-tds-line-default shrink-0 font-medium"
                >
                  중복 확인
                </Button>
              </div>
              <p className="text-[11px] text-tds-fg-tertiary">
                내 공유 주소: /{username || "아이디"}
              </p>
            </div>

            {/* 2. 화면 표시 닉네임 / 이름 (displayName) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-profile-name"
                  className="text-[13px] font-semibold text-tds-fg-secondary"
                >
                  표시 이름 (displayName) <span className="text-tds-fg-brand">*</span>
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
