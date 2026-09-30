# 마이링크(Mylink) 시연 1단계 PRD — LocalStorage 기반 프로필 페이지

> **문서 버전**: 1.2 (시연 1단계 전용 / 사용자 시나리오 추가)  
> **작성일**: 2026-09-30  
> **현재 목표**: 대시보드 및 통계 기능을 제외하고, **LocalStorage와 연동되어 동작하는 모바일 중심 공개 프로필 페이지(`/`)** 완성

---

## 1. 개요 및 시연 목표

### 1.1 서비스 개요
**마이링크(Mylink)**는 개인의 프로필 정보, 소셜 미디어, 추천 링크를 한곳에 모아 모바일 웹 형태로 간편하게 공유할 수 있는 서비스입니다.

### 1.2 시연 1단계 핵심 목표
- 별도의 관리자 대시보드나 로그인, 통계 차트 없이 **LocalStorage에 저장된 데이터를 읽어와서 렌더링하는 공개 프로필 페이지**를 먼저 완성합니다.
- LocalStorage에 저장된 데이터를 수정하거나 새로고침했을 때 프로필, 소셜 미디어, 섹션 및 링크가 유연하게 변경되는 모습을 시연할 수 있도록 설계합니다.

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
2. **LocalStorage 데이터 바인딩 & 초기 시드(Seed) 생성**
   - 페이지 최초 접속 시 LocalStorage를 확인하여 데이터가 없으면 **기본 데모 데이터 자동 주입**
   - LocalStorage에 데이터가 이미 있으면 해당 데이터를 읽어와 화면에 렌더링
   - 개발자 도구 콘솔/스토리지 탭에서 데이터 수정 후 새로고침 시 즉시 반영
3. **Toss Design System (TDS) UI 적용**
   - `design.md` 가이드라인 완벽 준수 (컬러 토큰, Pretendard 폰트, 라운딩, 해요체 문구)

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
export type SocialPlatform = "instagram" | "youtube" | "tiktok" | "x" | "github";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

// 3. 통합 콘텐츠 (섹션 헤더 or 링크 카드)
export interface ContentItem {
  id: string;
  type: "section" | "link";
  order: number;            // 렌더링 정렬 순서
  title: string;            // 섹션 타이틀 or 링크 타이틀
  desc?: string;            // 링크 설명 (type === "link" 일 때 선택)
  url?: string;             // 링크 URL (type === "link" 일 때 필수)
  emoji?: string;           // 링크 카드 아이콘 이모지 (예: "⚡", "📝")
}
```

---

### 4.3 초기 시드(Seed) 기본값 명세

사용자가 처음 접속하거나 스토리지를 비웠을 때 자동으로 로드되는 기본 데이터입니다.

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
  { "id": "s-x",  "platform": "x", "url": "https://x.com" }
]

// mylink_contents
[
  {
    "id": "c-sec-1",
    "type": "section",
    "order": 0,
    "title": "주요 링크"
  },
  {
    "id": "c-link-1",
    "type": "link",
    "order": 1,
    "emoji": "⚡",
    "title": "GitHub 저장소",
    "desc": "코드 저장소 · 오픈소스 기여 내역",
    "url": "https://github.com"
  },
  {
    "id": "c-link-2",
    "type": "link",
    "order": 2,
    "emoji": "📝",
    "title": "기술 블로그",
    "desc": "학습 기록 및 트러블슈팅 정리",
    "url": "https://velog.io"
  },
  {
    "id": "c-sec-2",
    "type": "section",
    "order": 3,
    "title": "프로젝트 & 활동"
  },
  {
    "id": "c-link-3",
    "type": "link",
    "order": 4,
    "emoji": "🎨",
    "title": "포트폴리오",
    "desc": "직접 만든 프로젝트 모아보기",
    "url": "https://example.com"
  }
]
```

---

## 5. 화면 및 컴포넌트 상세 명세 (`/`)

### 5.1 페이지 레이아웃 구조
- **컨테이너**: 화면 중앙 정렬, 최대 너비 `480px`, 양옆 패딩 `20px (px-5)`.
- **배경**: TDS `var(--tds-bg-primary)` (White).
- **하단 패딩**: 고정 Bottom CTA를 가리지 않도록 `pb-32` 확보.

### 5.2 세부 영역별 요구사항

1. **상단 프로필 영역**
   - 원형 프로필 아바타: `88px × 88px`, `border: 3px solid var(--tds-line-default)`
   - 이름: `text-2xl font-bold`, `var(--tds-fg-primary)`
   - 소속/직무(Headline): `text-[15px]`, `var(--tds-fg-secondary)`
   - 소개(Bio): 카드 형태 또는 인라인 텍스트로 자연스럽게 배치

2. **소셜 미디어 영역**
   - 등록된 소셜 플랫폼 아이콘 버튼 가로 나열
   - 원형 또는 부드러운 사각형(`radius-m`), 호버/터치 시 TDS 누름 인터랙션(`tds-pressed`)
   - 클릭 시 새 창(`target="_blank"`, `rel="noopener noreferrer"`)으로 해당 URL 이동

3. **콘텐츠 영역 (통합 목록)**
   - `order` 오름차순으로 정렬하여 표시
   - **`type === "section"` (섹션 헤더)**:
     - 상단 마진을 주어 그룹을 시각적으로 구분
     - 텍스트 크기 `text-[13px] font-semibold`, `var(--tds-fg-tertiary)`
     - 카테고리 제목 표시
   - **`type === "link"` (링크 카드)**:
     - TDS 카드 스타일: `border: 1px solid var(--tds-line-default)`, `rounded-2xl (18px)`
     - 좌측 이모지 아이콘 박스 (`40px × 40px`, 배경 `var(--tds-bg-secondary)`)
     - 중앙 타이틀(`text-[15px] font-semibold`) 및 부가 설명(`text-[13px] text-tertiary`)
     - 우측 셰브론(`>`) 아이콘
     - 클릭 시 새 창 오픈

4. **공유하기 버튼 & 토스트 (Toast)**
   - "이 페이지 공유하기" 텍스트 버튼 클릭 시 현재 브라우저 URL 복사
   - 화면 상단에 2.5초간 토스트 메시지 알림: `🔗 링크를 복사했어요!`

5. **하단 고정 CTA (Bottom CTA)**
   - 화면 하단 고정(`fixed bottom-0 left-0 right-0`)
   - 상단 그라디언트 보호 레이어 (`linear-gradient(to bottom, transparent, var(--tds-bg-primary) 40%)`)
   - 버튼 스타일: 높이 `56px`, `radius-full`, `var(--tds-bg-brand)`, 텍스트 White

---

## 6. UI/UX 디자인 가이드라인 (TDS 기준 준수)

| 항목 | TDS 규격 |
|------|----------|
| **Primary Color** | `oklch(0.624 0.176 254)` (Toss Blue-500) |
| **Font Family** | Pretendard Variable |
| **본문 타이포** | `body-2`: 15px / line-height 1.5 |
| **터치 피드백** | 클릭 시 미세한 오버레이 효과 (`tds-pressed`) |
| **금지 사항** | 복잡한 애니메이션/바운스 금지, 다크 테마 배제, 네온 그라디언트 배제 |
| **카피라이팅** | 친근한 해요체 사용 ("링크를 복사했어요!", "함께 성장해요 🌱") |

---

## 7. 시연 검증 시나리오 (Verification Checklist)

시연 중 원활하게 동작을 보여줄 수 있는지 확인할 수 있는 체크리스트입니다.

- [ ] **초기 접속 검증**: LocalStorage가 비어 있는 시크릿 창으로 접속했을 때 시드 데이터가 자동으로 채워지고 프로필과 링크가 정상 표시되는가?
- [ ] **데이터 변경 시연**:
  - 브라우저 개발자 도구(F12) > Application > Local Storage에서 `mylink_profile`의 `name`이나 `bio` 값을 수정한 후 새로고침했을 때 수정된 내용이 즉시 반영되는가?
  - `mylink_contents`에 새로운 링크 객체를 추가하거나 순서(`order`)를 변경했을 때 화면에 올바르게 반영되는가?
- [ ] **인터랙션 검증**:
  - 소셜 미디어 아이콘 및 링크 카드를 클릭했을 때 올바른 URL로 새 탭이 열리는가?
  - "이 페이지 공유하기" 클릭 시 복사 완료 토스트가 정상적으로 나타났다가 사라지는가?
- [ ] **모바일 뷰포트**: 모바일 디바이스 모드(375px ~ 430px) 및 PC 화면 모두에서 깨짐 없이 안정적으로 렌더링되는가?
