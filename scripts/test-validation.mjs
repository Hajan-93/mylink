import { linkFormSchema, normalizeUrl } from "../src/lib/validations/link.ts";

const testCases = [
  {
    name: "1. 빈 URL 입력",
    input: { title: "테스트", url: "" },
    expectedValid: false,
    expectedError: "URL 주소를 입력해 주세요.",
  },
  {
    name: "2. '123'과 같은 단순 숫자/문자열 입력",
    input: { title: "테스트", url: "123" },
    expectedValid: false,
    expectedError: "도메인 이름(예: github.com, velog.io)을 정확히 입력해 주세요.",
  },
  {
    name: "3. 'github.com' (프로토콜 생략)",
    input: { title: "깃허브", url: "github.com" },
    expectedValid: true,
    expectedNormalized: "https://github.com",
  },
  {
    name: "4. 'https://velog.io/@user' (정상 웹 URL)",
    input: { title: "벨로그", url: "https://velog.io/@user" },
    expectedValid: true,
    expectedNormalized: "https://velog.io/@user",
  },
  {
    name: "5. 'mailto:contact@example.com' (정상 이메일)",
    input: { title: "이메일", url: "mailto:contact@example.com" },
    expectedValid: true,
    expectedNormalized: "mailto:contact@example.com",
  },
  {
    name: "6. 'mailto:invalid-email' (잘못된 이메일)",
    input: { title: "이메일", url: "mailto:invalid-email" },
    expectedValid: false,
    expectedError: "올바른 이메일 주소(예: mailto:name@example.com)를 입력해 주세요.",
  },
  {
    name: "7. 'invalid-domain' (점 없는 도메인)",
    input: { title: "테스트", url: "invalid-domain" },
    expectedValid: false,
    expectedError: "도메인 이름(예: github.com, velog.io)을 정확히 입력해 주세요.",
  },
  {
    name: "8. 'example.c' (TLD가 1자인 잘못된 도메인)",
    input: { title: "테스트", url: "example.c" },
    expectedValid: false,
    expectedError: "도메인 이름(예: github.com, velog.io)을 정확히 입력해 주세요.",
  },
];

console.log("=== URL 검증 및 정규화 테스트 실행 ===\n");
let passedCount = 0;

for (const tc of testCases) {
  const result = linkFormSchema.safeParse(tc.input);

  if (tc.expectedValid) {
    if (result.success) {
      const normalized = normalizeUrl(tc.input.url);
      if (normalized === tc.expectedNormalized) {
        console.log(`✅ [PASS] ${tc.name}`);
        console.log(`   결과: 정규화 완료 -> ${normalized}`);
        passedCount++;
      } else {
        console.error(`❌ [FAIL] ${tc.name}: 정규화 불일치 (기대: ${tc.expectedNormalized}, 실제: ${normalized})`);
      }
    } else {
      console.error(`❌ [FAIL] ${tc.name}: 유효성 검증 실패:`, result.error.flatten().fieldErrors);
    }
  } else {
    if (!result.success) {
      const urlError = result.error.flatten().fieldErrors.url?.[0];
      if (urlError === tc.expectedError) {
        console.log(`✅ [PASS] ${tc.name}`);
        console.log(`   결과: 예상된 에러 발생 -> "${urlError}"`);
        passedCount++;
      } else {
        console.error(`❌ [FAIL] ${tc.name}: 에러 메시지 불일치 (기대: "${tc.expectedError}", 실제: "${urlError}")`);
      }
    } else {
      console.error(`❌ [FAIL] ${tc.name}: 유효하지 않은 입력인데 검증을 통과함!`);
    }
  }
}

console.log(`\n테스트 결과: ${passedCount}/${testCases.length} 통과`);
if (passedCount === testCases.length) {
  console.log("🎉 모든 URL 검증 및 정규화 테스트를 성공적으로 통과했습니다!");
} else {
  process.exit(1);
}
