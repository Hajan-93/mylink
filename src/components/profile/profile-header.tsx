"use client";

import React from "react";
import { ProfileData, SocialLink } from "@/types";
import { ProfileAvatar } from "./profile-avatar";
import { SocialLinks } from "@/components/social-links";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: ProfileData;
  socials?: SocialLink[];
  className?: string;
}

/**
 * 프로필 상단 헤더 컴포넌트
 * 아바타, 이름, 소속/직무(헤드라인), 소개글(Bio), 소셜 미디어 링크 영역을 통합합니다.
 */
export function ProfileHeader({
  profile,
  socials = [],
  className,
}: ProfileHeaderProps) {
  return (
    <section
      className={cn(
        "flex flex-col items-center pt-12 pb-2 gap-4 text-center select-none",
        className
      )}
    >
      {/* 아바타 */}
      <ProfileAvatar src={profile.avatarUrl} name={profile.name} size={88} />

      {/* 이름 및 직무 소개 */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-bold tracking-tight text-tds-fg-primary">
          {profile.name}
        </h1>
        {profile.headline && (
          <p className="text-[15px] font-medium leading-relaxed text-tds-fg-secondary">
            {profile.headline}
          </p>
        )}
      </div>

      {/* 소개글(Bio) */}
      {profile.bio && (
        <p className="text-[14px] leading-relaxed max-w-[360px] px-2 text-center text-tds-fg-secondary">
          {profile.bio}
        </p>
      )}

      {/* 소셜 링크 */}
      {socials.length > 0 && (
        <div className="pt-1">
          <SocialLinks socials={socials} />
        </div>
      )}
    </section>
  );
}
