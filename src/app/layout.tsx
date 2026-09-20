import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전하진 | My Link Profile",
  description: "매일 한 줄의 코드로 성장해 나가는 초보 개발자 전하진의 링크 프로필입니다. 🌱",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
