import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * 프로필 아바타 컴포넌트 (TDS 88px 규격 및 테두리 지원)
 */
export function ProfileAvatar({
  src,
  name,
  size = 88,
  className,
}: ProfileAvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 shadow-sm border-[3px] border-tds-line-default bg-tds-bg-secondary",
        className
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image
        src={src || "/profile.svg"}
        alt={`${name} 프로필 이미지`}
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority
      />
    </div>
  );
}
