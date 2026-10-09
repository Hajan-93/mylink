# 마이링크(Mylink) 시연 1단계 PRD — LocalStorage 기반 프로필 페이지

> **문서 버전**: 1.5 (재사용 프로필 도메인 컴포넌트 아키텍처 및 Tailwind CSS v4 토큰화 반영)  
> **작성일**: 2026-09-30 (업데이트: 2026-10-09)  
> **현재 목표**: 대시보드 및 통계 기능을 제외하고, **LocalStorage/Mock API와 연동되어 동작하는 모바일 중심 공개 프로필 페이지(`/`)** 완성

---

## 1. 개요 및 시연 목표

### 1.1 서비스 개요
**마이링크(Mylink)**는 개인의 프로필 정보, 소셜 미디어, 추천 링크를 한곳에 모아 모바일 웹 형태로 간편하게 공유할 수 있는 서비스입니다.

### 1.2 시연 1단계 핵심 목표
- 별도의 관리자 대시보드나 로그인, 통계 차트 없이 **LocalStorage에 저장된 데이터를 읽어와서 렌더링하는 공개 프로필 페이지**를 먼저 완성합니다.
- LocalStorage에 저장된 데이터를 수정하거나 새로고침했을 때 프로필, 소셜 미디어, 섹션 및 링크가 유연하게 변경되는 모습을 시연할 수 있도록 설계합니다.
- 유지보수성과 확장성을 위해 모놀리식 페이지 구조를 지양하고 **재사용 가능한 프로필 도메인 컴포넌트 아키텍처**와 **Tailwind CSS v4 테마 토큰 시스템**을 구축합니다.

---

## 2. 사용자 페르소나 및 시나리오 (User Scenarios)

### 2.1 페르소나 정의

| 페르소나 | 역할 및 특징 | 주요 니즈 |
|----------|--------------|-----------|
| **방문자 (민우)** | 크리에이터/개발자의 링크를 전달받아 둘러보는 채용 담당자 또는 커피챗 희망자 | 모바일 환경에서 프로필과 링크를 빠르고 깔끔하게 탐색하고 손쉽게 연락하기 |
| **시연자 / 소유자 (하진)** | 자신의 프로필과 작업물을 마이링크로 제작해 사람들에게 보여주는 개발자 | 별도 백엔드 없이도 LocalStorage를 통해 데이터가 안정적으로 유지되고 수정 가능함을 증명하기 |

---

### 2.2 핵심 사용자 시나리오

#### 시나리오 1: 방문자의 프로필 탐색 및 링크 이용 (기본 흐름)
1. **진입**: 방문자(민우)가 인스타그램 프로필이나 이력서에 첨부된 마이링크 URL(`https://.../`)로 접속합니다.
2. **프로필 확인**: 깔끔한 Toss 스타일의 화면 중앙에 아바타 이미지, 이름("전하진"), 직무 소개("주니어 프론트엔드 개발자"), 간단한 바이오 글을 확인합니다.
3. **소셜 채널 탐색**: 상단의 소셜 미디어 아이콘(GitHub, Instagram, X) 중 GitHub 아이콘을 터치하여 새 탭에서 깃허브 저장소를 확인합니다.
4. **링크 탐색**: '주요 링크' 및 '프로젝트 & 활동' 섹션 헤더로 잘 정돈된 링크 카드들을 스크롤하며 둘러보고, '기술 블로그' 카드를 클릭해 블로그 글을 읽습니다.
5. **연락(CTA)**: 페이지 하단에 항상 눈에 띄게 떠 있는 고정 버튼 [커피챗 신청하기 ☕]를 터치하여 메일 전송 화면을 호출합니다.

---

#### 시나리오 2: 방문자의 프로필 페이지 공유 (공유 흐름)
1. **공유 의도**: 민우는 하진의 마이링크 페이지 구성이 마음에 들어 동료 팀원에게 추천해주고 싶어 합니다.
2. **공유 버튼 클릭**: 링크 목록 아래에 있는 [이 페이지 공유하기] 텍스트 버튼을 클릭합니다.
3. **피드백 확인**: 화면 상단에 `🔗 링크를 복사했어요!`라는 부드러운 Toss 스타일의 토스트 메시지가 나타났다가 2.5초 뒤 자연스럽게 사라집니다.
4. **전달**: 복사된 링크를 메신저(슬랙, 카카오톡)에 붙여넣어 동료에게 전송합니다.

---

#### 시나리오 3: 시연자의 실시간 데이터 조작 및 변경 반영 (시연 핵심 시나리오)
1. **시연 준비**: 시연자(하진)는 발표 도중 마이링크의 동적 데이터 렌더링 구조를 증명하고자 합니다.
2. **스토리지 접근**: 브라우저 개발자 도구(F12) > Application > Local Storage 패널을 엽니다.
3. **프로필 데이터 수정**: `mylink_profile`의 `name`을 `"전하진"`에서 `"전하진 (Frontend Lead)"`로 수정하고, `bio` 문구를 변경합니다.
4. **링크 목록 수정**: `mylink_contents` 배열에 새로운 링크 객체(예: 포트폴리오 추가)를 넣거나 `order` 번호를 변경하여 순서를 바꿉니다.
5. **화면 갱신**: 브라우저 새로고침(F5)을 누릅니다.
6. **결과 확인**: 백엔드 DB가 없어도 클라이언트의 LocalStorage 데이터를 파싱하여 바뀐 이름과 새로운 링크 카드가 정확한 순서로 즉시 렌더링되는 모습을 청중에게 보여줍니다.

---

#### 시나리오 4: 최초 사용자 / 시크릿 모드 접속 (초기 시드 주입)
1. **클린 상태 진입**: 사용자가 이전에 방문한 적 없는 새 기기 또는 시크릿 창(Incognito)으로 프로필 페이지에 접근합니다.
2. **시드 감지 및 주입**: 앱 초기화 로직이 LocalStorage 내 키(`mylink_profile`, `mylink_contents` 등)가 비어 있음을 감지합니다.
3. **자동 복구/초기화**: 에러를 뿜거나 빈 화면을 노출하지 않고, 시스템에 정의된 기본 시드(Seed) 데이터를 자동으로 LocalStorage에 기록합니다.
4. **자연스러운 렌더링**: 방문자는 완성도 높은 데모 프로필을 즉시 경험할 수 있습니다.

---

#### 시나리오 5: 예외 처리 및 스토리지 복구 (데이터 보호)
1. **스토리지 손상 발생**: 사용자가 LocalStorage 값을 수정하다가 잘못된 JSON 문법(오타 등)을 입력하거나 실수로 삭제합니다.
2. **에러 핸들링**: 앱이 JSON 파싱 에러를 `try-catch`로 포착합니다.
3. **Fallback 동작**: 비정상 데이터로 인해 화면이 멈추지(White Screen) 않도록 기본 Fallback 데이터를 화면에 표시하고 스토리지를 안전하게 재초기화합니다.

---

## 3. 기능 범위 (Scope)

### ✅ 이번 단계(1단계)에 포함되는 기능
1. **공개 프로필 페이지 (`/`) 렌더링**
   - 모바일 우선 레이아웃 (최대 너비 480px, 중앙 정렬)
   - 프로필 영역: 프로필 이미지, 이름, 소속/직무, 소개글
   - 소셜 미디어 영역: 등록된 플랫폼별 아이콘 및 새 탭 링크
   - 콘텐츠 영역: 카테고리 구분을 위한 **섹션 헤더** 및 **URL 링크 카드**
   - 유틸리티: 페이지 URL 클립보드 복사 공유 토스트, 하단 고정 CTA 버튼
2. **LocalStorage 데이터 바인딩 & 초기 시드(Seed) 자동 주입 및 복구 (`src/lib/storage.ts`)**
   - 페이지 최초 접속 시 LocalStorage를 확인하여 데이터가 없으면 **기본 데모 데이터 자동 주입**
   - LocalStorage에 데이터가 이미 있으면 해당 데이터를 읽어와 화면에 렌더링
   - 개발자 도구 콘솔/스토리지 탭에서 데이터 수정 후 새로고침 시 즉시 반영
   - `storage` 이벤트 리스너를 통한 멀티 탭/창 실시간 동기화 지원
3. **재사용 가능한 프로필 도메인 컴포넌트 아키텍처 구축 (`src/components/profile/`)**
   - 단일 페이지 모놀리식 마크업을 탈피하고 재사용 가능한 전용 도메인 컴포넌트로 책임 분리:
     - `ProfileAvatar`: 88×88 원형 아바타 및 외곽선
     - `ProfileHeader`: 아바타, 이름, 헤드라인, 바이오, 소셜 링크 통합
     - `LinkCard`: 단일 링크 카드 (이모지, 타이틀, 설명, 셰브론, 터치 피드백)
     - `SectionHeader`: 카테고리 헤더
     - `BottomCta`: 하단 고정 CTA 및 상단 보호 그라디언트
     - `ShareButton`: URL 복사 공유 버튼
     - `index.ts`: 배럴 export
4. **Tailwind CSS v4 기반 토스 디자인 시스템(TDS) 스타일링**
   - 인라인 스타일을 전면 지양하고 **Tailwind CSS v4 `@theme inline`**에 TDS 토큰을 직접 등록
   - `bg-tds-bg-primary`, `text-tds-fg-primary`, `border-tds-line-default`, `shadow-tds-card` 등 100% 순수 Tailwind 유틸리티 클래스로 스타일링

### ⏸️ 다음 단계로 미루는 기능 (이번 단계 제외)
- ❌ Mock Google 로그인 및 인증 상태 관리
- ❌ 관리자 대시보드 (`/admin`) 및 편집 폼 UI
- ❌ 드래그 앤 드롭(Drag & Drop) 순서 편집기
- ❌ 테마 선택 및 전환 기능 (TDS 기본 Light 테마 단일 적용)
- ❌ 방문자 수 및 링크 클릭 수 집계 통계 / Recharts 차트

---

## 4. LocalStorage 데이터 스키마

데이터는 `window.localStorage`에 3개의 키로 분리하여 JSON 문자열 형태로 보관합니다.

### 4.1 저장소 키 구성

| 키 이름 | 타입 | 설명 |
|---------|------|------|
| `mylink_profile` | `ProfileData` (JSON) | 기본 프로필 정보 (이름, 소개, 소속, 이미지 등) |
| `mylink_socials` | `SocialLink[]` (JSON) | 소셜 미디어 링크 목록 |
| `mylink_contents` | `ContentItem[]` (JSON) | 섹션 헤더 및 URL 링크 통합 목록 (순서 보장) |

---

### 4.2 TypeScript 타입 정의

```typescript
// 1. 프로필 정보
export interface ProfileData {
  name: string;             // 표시 이름 (예: "전하진")
  headline: string;         // 한 줄 소속/직무 (예: "주니어 프론트엔드 개발자 · 광운대학교")
  bio: string;              // 상세 소개글
  avatarUrl: string;        // 프로필 이미지 경로 (예: "/profile.svg")
  bottomCtaText: string;    // 하단 CTA 버튼 텍스트 (예: "커피챗 신청하기 ☕")
  bottomCtaUrl: string;     // 하단 CTA 링크 (예: "mailto:contact@example.com")
}

// 2. 소셜 미디어 플랫폼
export type SocialPlatform = "github" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

// 3. 단일 링크 아이템 (id, title, url 필수 규칙)
export interface LinkItem {
  id: string;               // 고유 식별자 (필수)
  title: string;            // 링크 제목 (필수)
  url: string;              // 연결 대상 URL (필수)
  desc?: string;            // 링크 상세 설명 (선택)
  emoji?: string;           // 링크 카드 아이콘 이모지 (선택)
  category?: string;        // 카테고리 (선택)
  order?: number;           // 정렬 순서 (선택)
  external?: boolean;       // 새 창 열기 여부 (선택)
}

// 4. 통합 콘텐츠 (섹션 헤더 or 링크 카드)
export interface ContentItem {
  id: string;
  type: "section" | "link";
  order: number;            // 렌더링 정렬 순서
  title: string;            // 섹션 타이틀 or 링크 타이틀
  desc?: string;            // 링크 설명 (type === "link" 일 때 선택)
  url?: string;             // 링크 URL (type === "link" 일 때 필수)
  emoji?: string;           // 링크 카드 아이콘 이모지 (예: "⚡", "📝")
  category?: string;        // 카테고리 (선택)
}
```

---

### 4.3 초기 시드(Seed) 기본값 명세

사용자가 처음 접속하거나 스토리지를 비웠을 때 자동으로 로드되는 기본 시드 데이터입니다. 모든 링크 아이템은 `id`, `title`, `url`을 필수로 보유합니다.

```json
// mylink_profile
{
  "name": "전하진",
  "headline": "주니어 프론트엔드 개발자 · 광운대학교",
  "bio": "안녕하세요! 새로운 기술 탐구와 직접 만드는 즐거움을 좋아하는 개발자예요. 함께 성장해요 🌱",
  "avatarUrl": "/profile.svg",
  "bottomCtaText": "커피챗 신청하기 ☕",
  "bottomCtaUrl": "mailto:contact@example.com"
}

// mylink_socials
[
  { "id": "s-gh", "platform": "github", "url": "https://github.com" },
  { "id": "s-in", "platform": "instagram", "url": "https://instagram.com" },
  { "id": "s-x",  "platform": "x", "url": "https://x.com" },
  { "id": "s-li", "platform": "linkedin", "url": "https://linkedin.com" }
]

// mylink_contents
[
  { "id": "c-sec-1", "type": "section", "order": 0, "title": "주요 링크" },
  { "id": "c-link-1", "type": "link", "order": 1, "emoji": "⚡", "title": "GitHub 저장소", "desc": "오픈소스 기여 및 일일 잔디 심기 기록", "url": "https://github.com" },
  { "id": "c-link-2", "type": "link", "order": 2, "emoji": "📝", "title": "기술 블로그 (Velog)", "desc": "학습 기록, 트러블슈팅, 회고글 모아보기", "url": "https://velog.io" },
  { "id": "c-link-3", "type": "link", "order": 3, "emoji": "📄", "title": "노션 이력서 & 포트폴리오", "desc": "경력 사항, 기술 스택, 프로젝트 상세 명세", "url": "https://notion.so" },

  { "id": "c-sec-2", "type": "section", "order": 4, "title": "프로젝트 & 활동" },
  { "id": "c-link-4", "type": "link", "order": 5, "emoji": "🔗", "title": "MyLink — 모바일 링크인바이오 서비스", "desc": "Next.js & TDS 기반의 간편 링크 공유 프로필", "url": "https://github.com" },
  { "id": "c-link-5", "type": "link", "order": 6, "emoji": "💳", "title": "Toss UI 클론 프로젝트", "desc": "토스 디자인 시스템(TDS) 컴포넌트 라이브러리 구현", "url": "https://github.com" },
  { "id": "c-link-6", "type": "link", "order": 7, "emoji": "🎨", "title": "인터랙티브 웹 아트 갤러리", "desc": "Canvas & WebGL을 활용한 인터랙티브 그래픽 작업물", "url": "https://example.com" },

  { "id": "c-sec-3", "type": "section", "order": 8, "title": "추천 아티클" },
  { "id": "c-link-7", "type": "link", "order": 9, "emoji": "💡", "title": "React 19와 Next.js 최신 변경점 정리", "desc": "서버 컴포넌트와 액션으로 변화하는 프론트엔드 생태계", "url": "https://velog.io" },
  { "id": "c-link-8", "type": "link", "order": 10, "emoji": "🎯", "title": "토스 디자인 시스템(TDS) 인터랙션 뽀개기", "desc": "모바일 웹에서 네이티브 앱 같은 터치감 구현하기", "url": "https://velog.io" },

  { "id": "c-sec-4", "type": "section", "order": 11, "title": "네트워킹" },
  { "id": "c-link-9", "type": "link", "order": 12, "emoji": "☕", "title": "1:1 커피챗 예약 (구글 캘린더)", "desc": "이직, 커리어, 기술 이야기 언제든 환영해요", "url": "https://calendly.com" },
  { "id": "c-link-10", "type": "link", "order": 13, "emoji": "✉️", "title": "이메일로 문의하기", "desc": "협업 제안이나 질문은 편하게 메일 남겨주세요", "url": "mailto:contact@example.com" }
]
```

---

### 4.4 표준 더미 데이터 및 Mock API 명세

프로젝트의 개발 및 시연 편의를 위해 표준 더미 데이터 파일과 Next.js Route Handler 기반의 Mock API를 제공합니다.

#### 1. 필수 필드 보장 규칙
* **모든 링크 데이터는 반드시 `id`, `title`, `url`을 필수로 포함**해야 합니다.
* 부가 정보(`desc`, `emoji`, `category`, `order` 등)는 선택 사항입니다.

#### 2. 참조 파일 위치
* **순수 링크 목록 JSON**: `src/data/links.json` (각 객체에 `id`, `title`, `url` 필수 포함)
* **통합 DB 엔티티 Mock JSON**: `src/data/mock-data.json` (프로필, 통계, 소셜, 링크 통합)
* **TypeScript 더미 상수**: `src/data/dummy-data.ts` (`DUMMY_LINKS`, `DUMMY_CONTENTS`, `DUMMY_PROFILE`, `DUMMY_SOCIALS`)
* **타입 정의**: `src/types/index.ts` 및 `src/types/api.ts`
* **LocalStorage 스토리지 유틸리티**: `src/lib/storage.ts` (초기 시드 주입, 데이터 로드/저장, 예외 복구)
* **재사용 프로필 도메인 컴포넌트**: `src/components/profile/` (`ProfileAvatar`, `ProfileHeader`, `LinkCard`, `SectionHeader`, `BottomCta`, `ShareButton`, `index.ts`)

#### 3. Mock API 엔드포인트 명세
| 메소드 | 엔드포인트 | 설명 | 필수 응답 필드 |
|--------|------------|------|----------------|
| `GET` | `/api/links` | 링크 목록 조회 (`?category=`, `?activeOnly=` 쿼리 파라미터 지원) | `id`, `title`, `url` |
| `POST` | `/api/links` | 신규 링크 등록 시뮬레이션 (`title`, `url` 검증) | `id`, `title`, `url` |
| `GET` | `/api/profile` | 기본 프로필 및 소셜 미디어 정보 조회 | 프로필 및 소셜 DTO |

---

## 5. 화면 및 컴포넌트 상세 명세 (`/`)

### 5.1 페이지 레이아웃 구조
- **컨테이너**: 화면 중앙 정렬, 최대 너비 `480px`, 양옆 패딩 `20px (px-5)`.
- **배경**: TDS `bg-tds-bg-primary` (White).
- **하단 패딩**: 고정 Bottom CTA를 가리지 않도록 `pb-32` 확보.

### 5.2 세부 영역별 요구사항

1. **상단 프로필 영역**
   - 원형 프로필 아바타: `88px × 88px`, `border-[3px] border-tds-line-default`
   - 이름: `text-2xl font-bold`, `text-tds-fg-primary`
   - 소속/직무(Headline): `text-[15px] font-medium`, `text-tds-fg-secondary`
   - 소개(Bio): `text-[14px] leading-relaxed max-w-[360px]`, `text-tds-fg-secondary`

2. **소셜 미디어 영역**
   - 등록된 소셜 플랫폼 아이콘 버튼 가로 나열
   - 부드러운 사각형(`rounded-[12px]`), 배경 `bg-tds-bg-secondary`, 호버/터치 시 TDS 누름 인터랙션(`tds-pressed`)
   - 클릭 시 새 창(`target="_blank"`, `rel="noopener noreferrer"`)으로 해당 URL 이동

3. **콘텐츠 영역 (통합 목록)**
   - `order` 오름차순으로 정렬하여 표시
   - **`type === "section"` (섹션 헤더)**:
     - 상단 마진을 주어 그룹을 시각적으로 구분 (`pt-6 pb-1`)
     - 텍스트 크기 `text-[13px] font-semibold`, `text-tds-fg-tertiary`
     - 카테고리 제목 표시
   - **`type === "link"` (링크 카드)**:
     - TDS 카드 스타일: `border border-tds-line-default`, `rounded-2xl`, `shadow-tds-card`
     - 좌측 이모지 아이콘 박스 (`40px × 40px`, 배경 `bg-tds-bg-secondary`, `rounded-[12px]`)
     - 중앙 타이틀(`text-[15px] font-semibold text-tds-fg-primary`) 및 부가 설명(`text-[13px] text-tds-fg-tertiary`)
     - 우측 셰브론(`>`) 아이콘 (`text-tds-fg-disabled`)
     - 클릭 시 새 창 오픈

4. **공유하기 버튼 & 토스트 (Toast)**
   - "이 페이지 공유하기" 텍스트 버튼 클릭 시 현재 브라우저 URL 복사
   - 화면 상단에 2.5초간 토스트 메시지 알림: `🔗 링크를 복사했어요!` (`bg-tds-fg-primary`, `shadow-tds-toast`, `rounded-2xl`)

5. **하단 고정 CTA (Bottom CTA)**
   - 화면 하단 고정(`fixed bottom-0 left-0 right-0 z-40`)
   - 상단 그라디언트 보호 레이어 (`bg-gradient-to-b from-transparent via-tds-bg-primary/70 to-tds-bg-primary pt-8 pb-6`)
   - 버튼 스타일: 높이 `56px (h-14)`, 최대 너비 480px, `rounded-full`, `bg-tds-bg-brand`, 텍스트 White, `tds-pressed`

---

## 6. 재사용 가능한 프로필 도메인 컴포넌트 아키텍처 (`src/components/profile/`)

UI의 재사용성과 유지보수성을 극대화하기 위해 프로필 도메인 전용 컴포넌트 모듈을 구축하여 사용합니다.

```
src/components/profile/
├── profile-avatar.tsx   # TDS 규격 88x88 원형 아바타 (Next.js Image 최적화)
├── profile-header.tsx   # 아바타, 이름, 직무, 소개글, 소셜 미디어 통합 헤더
├── link-card.tsx        # TDS 표준 단일 링크 카드 (이모지, 텍스트, 셰브론, 터치 피드백)
├── section-header.tsx   # 링크 그룹 구분을 위한 섹션 타이틀 컴포넌트
├── bottom-cta.tsx       # 상단 보호 그라디언트가 포함된 화면 최하단 고정 CTA
├── share-button.tsx     # 클립보드 URL 복사 및 공유 인터랙션 버튼
└── index.ts             # 배럴 export
```

### 도메인 컴포넌트별 상세 규격
| 컴포넌트 | Props 인터페이스 | 구현 내용 및 스타일 규칙 |
|---|---|---|
| **`ProfileAvatar`** | `src?: string, name: string, size?: number` | 88×88 기본 크기, `rounded-full`, `border-[3px] border-tds-line-default`, fallback 이미지 자동 대응 |
| **`ProfileHeader`** | `profile: ProfileData, socials?: SocialLink[]` | 아바타, 이름, 헤드라인, 상세 소개글, 소셜 채널 영역을 조합한 상단 영역 통합 컨테이너 |
| **`LinkCard`** | `id: string, title: string, url: string, desc?: string, emoji?: string, external?: boolean` | `rounded-2xl`, `shadow-tds-card`, 40×40 이모지 박스, 텍스트 말줄임, `tds-pressed` 터치 피드백, 새 탭 링크 |
| **`SectionHeader`** | `title: string, isFirst?: boolean` | `text-[13px] font-semibold text-tds-fg-tertiary`, 첫 섹션 여부에 따른 최적 마진 적용 |
| **`BottomCta`** | `text: string, url?: string, onClick?: () => void` | `fixed bottom-0`, 상단 투명→White 보호 그라디언트, `h-14`, `rounded-full`, `bg-tds-bg-brand` |
| **`ShareButton`** | `onCopied?: () => void, label?: string` | `navigator.clipboard` 기반 URL 복사 및 상위 토스트 트리거 연동 |

---

## 7. UI/UX 디자인 시스템 아키텍처 (Tailwind CSS v4 기반 TDS 구현)

마이링크의 모든 UI는 **Tailwind CSS v4**의 현대적인 테마 토큰화 시스템과 **shadcn/ui** 접근성 표준을 기반으로 구축하며, `design.md`에 명시된 **토스 디자인 시스템(TDS)** 규격을 100% 준수합니다.

### 7.1 디자인 시스템 구성 원칙

1. **컴포넌트 구조 (Headless & Primitives)**:
   - `shadcn/ui` (Base UI / Radix UI + Tailwind CSS v4)를 원시 컴포넌트로 활용하여 높은 접근성, 포커스 링, 키보드 인터랙션 보장
2. **시각적 스타일링 (Tailwind v4 `@theme inline` 바인딩)**:
   - 인라인 `style={{ ... }}` 작성을 전면 금지하고, `globals.css`의 `@theme inline`에 TDS OKLCH 컬러 및 섀도우 토큰을 등록하여 순수 Tailwind 유틸리티 클래스로 통일
3. **토스 고유 인터랙션 (TDS Pressed)**:
   - 토스 특유의 탭/클릭 오버레이(`tds-pressed`, `oklch(0 0 0 / 0.26)`) 및 가속 곡선(`cubic-bezier(0.22, 0.61, 0.36, 1)`) 적용

---

### 7.2 Tailwind CSS v4 TDS 토큰 매핑 규격 (`src/app/globals.css`)

```css
@theme inline {
  --color-background: var(--tds-bg-primary);
  --color-foreground: var(--tds-fg-primary);

  /* TDS Color Tokens */
  --color-tds-bg-primary: var(--tds-bg-primary);     /* oklch(1.000 0.000 0) */
  --color-tds-bg-secondary: var(--tds-bg-secondary); /* oklch(0.957 0.005 247) */
  --color-tds-bg-tertiary: var(--tds-bg-tertiary);   /* oklch(0.932 0.008 247) */
  --color-tds-bg-brand: var(--tds-bg-brand);         /* oklch(0.624 0.176 254) */

  --color-tds-fg-primary: var(--tds-fg-primary);     /* oklch(0.234 0.030 254) */
  --color-tds-fg-secondary: var(--tds-fg-secondary); /* oklch(0.452 0.028 253) */
  --color-tds-fg-tertiary: var(--tds-fg-tertiary);   /* oklch(0.590 0.022 255) */
  --color-tds-fg-placeholder: var(--tds-fg-placeholder);
  --color-tds-fg-disabled: var(--tds-fg-disabled);
  --color-tds-fg-brand: var(--tds-fg-brand);

  --color-tds-line-default: var(--tds-line-default); /* oklch(0.913 0.008 247) */
  --color-tds-line-strong: var(--tds-line-strong);

  /* TDS Shadow Tokens */
  --shadow-tds-card: var(--tds-shadow-card);
  --shadow-tds-toast: var(--tds-shadow-toast);
}
```

---

### 7.3 TDS 핵심 디자인 토큰 요약

| 항목 | TDS 규격 및 토큰 | Tailwind 유틸리티 클래스 |
|------|-------------------|--------------------------|
| **Primary CTA** | `oklch(0.624 0.176 254)` (blue-500) | `bg-tds-bg-brand`, `text-tds-fg-brand` |
| **Text Primary** | `oklch(0.234 0.030 254)` (grey-900) | `text-tds-fg-primary` |
| **Text Secondary** | `oklch(0.452 0.028 253)` (grey-700) | `text-tds-fg-secondary` |
| **Text Tertiary** | `oklch(0.590 0.022 255)` (grey-500) | `text-tds-fg-tertiary` |
| **Border Default** | `oklch(0.913 0.008 247)` (grey-200) | `border-tds-line-default` |
| **Background Primary** | `oklch(1.000 0.000 0)` (white) | `bg-tds-bg-primary` |
| **Background Secondary** | `oklch(0.957 0.005 247)` (grey-100) | `bg-tds-bg-secondary` |
| **Typography** | `Pretendard Variable`, sans-serif | `font-sans` |
| **Card Shadow** | `0 2px 8px oklch(0.155 0.060 261 / 0.08)` | `shadow-tds-card` |
| **Toast Shadow** | `0 8px 24px oklch(0.155 0.060 261 / 0.16)` | `shadow-tds-toast` |

---

### 7.4 디자인 및 카피라이팅 원칙

1. **톤앤매너**:
   - 정중하고 친근한 **해요체(-요)**만 사용 (예: "링크를 복사했어요!", "함께 성장해요 🌱")
   - 딱딱한 단정형(-다) 금지
2. **Bottom CTA**:
   - 모바일 화면 최하단에 56px 높이로 고정
   - 스크롤 콘텐츠 가독성을 위해 버튼 상단에 White→Transparent 보호 그라디언트 레이어 필수 적용
3. **엄격한 금지 사항**:
   - 다크 테마/다크 배경 원칙적 금지 (TDS Light 단일 기조)
   - 요란한 바운스/shimmer 애니메이션 금지
   - 지정된 3가지 예외(Bottom CTA 상단 보호, 로딩 glow, 일러스트) 외에 임의의 원색 그라디언트 사용 금지

---

## 8. 시연 검증 시나리오 (Verification Checklist)

시연 중 원활하게 동작을 보여줄 수 있는지 확인할 수 있는 체크리스트입니다.

- [ ] **초기 접속 검증**: LocalStorage가 비어 있는 시크릿 창으로 접속했을 때 시드 데이터가 자동으로 채워지고 프로필과 링크가 정상 표시되는가?
- [ ] **데이터 변경 시연**:
  - 브라우저 개발자 도구(F12) > Application > Local Storage에서 `mylink_profile`의 `name`이나 `bio` 값을 수정한 후 새로고침했을 때 수정된 내용이 즉시 반영되는가?
  - `mylink_contents`에 새로운 링크 객체를 추가하거나 순서(`order`)를 변경했을 때 화면에 올바르게 반영되는가?
- [ ] **인터랙션 검증**:
  - 소셜 미디어 아이콘 및 링크 카드를 클릭했을 때 올바른 URL로 새 탭이 열리는가?
  - "이 페이지 공유하기" 클릭 시 복사 완료 토스트가 정상적으로 나타났다가 사라지는가?
- [ ] **모바일 뷰포트**: 모바일 디바이스 모드(375px ~ 430px) 및 PC 화면 모두에서 깨짐 없이 안정적으로 렌더링되는가?
- [ ] **아키텍처 및 스타일 검증**:
  - `src/components/profile/` 도메인 컴포넌트가 적절히 모듈화되어 동작하는가?
  - 인라인 스타일 없이 Tailwind CSS v4 토큰 유틸리티 클래스로 일관되게 렌더링되는가?
