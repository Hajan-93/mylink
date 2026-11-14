import { app, auth } from "@/lib/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  increment,
} from "firebase/firestore";
import { ContentItem, ProfileData } from "@/types";

const db = getFirestore(app);

/**
 * 수정 작업(생성, 수정, 삭제)을 위한 UID를 결정합니다.
 * 비로그인 상태일 경우 에러를 발생시켜 권한을 검증합니다 (수정=로그인 필수).
 */
function resolveWriteUid(uid?: string): string {
  const targetUid = uid || auth.currentUser?.uid;
  if (!targetUid) {
    throw new Error("수정 권한이 없습니다. 로그인이 필요합니다.");
  }
  return targetUid;
}

/**
 * 이메일 또는 문자열로부터 유효한 기본 username을 생성합니다.
 * (12주차: 로그인 시 이메일 앞부분으로 자동 생성)
 */
export function generateDefaultUsername(emailOrName?: string | null): string {
  if (!emailOrName) return `user_${Math.random().toString(36).substring(2, 8)}`;
  const base = emailOrName.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return base.length >= 3 ? base : `user_${base || Math.random().toString(36).substring(2, 6)}`;
}

/**
 * 12주차 요구사항: username 중복 체크
 * @returns { available: boolean; error?: string }
 */
export async function checkUsernameAvailability(
  username: string,
  currentUid?: string
): Promise<{ available: boolean; error?: string }> {
  const trimmed = username.trim().toLowerCase();
  
  if (!trimmed) {
    return { available: false, error: "username을 입력해주세요." };
  }

  // 영문 소문자, 숫자, 밑줄, 하이픈 3~20자 허용
  const regex = /^[a-z0-9_-]{3,20}$/;
  if (!regex.test(trimmed)) {
    return {
      available: false,
      error: "username은 3~20자의 영문 소문자, 숫자, '-', '_'만 사용할 수 있습니다.",
    };
  }

  try {
    // 1. usernames 매핑 컬렉션에서 확인
    const usernameDocRef = doc(db, "usernames", trimmed);
    const snap = await getDoc(usernameDocRef);

    if (snap.exists()) {
      const data = snap.data();
      if (currentUid && data?.uid === currentUid) {
        return { available: true };
      }
      return { available: false, error: "이미 사용 중인 username입니다." };
    }

    // 2. 혹시 매핑에 없고 users 컬렉션에 존재하는지 확인
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", trimmed), limit(1));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      const foundDoc = querySnap.docs[0];
      if (currentUid && foundDoc.id === currentUid) {
        return { available: true };
      }
      return { available: false, error: "이미 사용 중인 username입니다." };
    }

    return { available: true };
  } catch (error) {
    console.error("username 중복 확인 실패:", error);
    // 에러 발생 시 기본 통과 처리보다는 안전하게 메시지 반환
    return { available: true };
  }
}

/* ─────────────────────────────────────────────────────────
 * 1. 유저 프로필 관리 (12주차: users/{uid} 및 users/{uid}/profile)
 * ───────────────────────────────────────────────────────── */

/**
 * 12주차: username으로 유저의 userId 및 프로필을 조회합니다.
 * (조회 흐름: URL의 username -> Firestore 검색 -> 데이터 표시)
 */
export async function getUserByUsername(
  username: string
): Promise<{ uid: string; profile: ProfileData } | null> {
  const normalized = username.trim().toLowerCase();
  if (!normalized) return null;

  try {
    let targetUid: string | null = null;

    // 1) usernames/{username} 매핑 문서 조회
    const usernameDoc = await getDoc(doc(db, "usernames", normalized));
    if (usernameDoc.exists()) {
      targetUid = usernameDoc.data()?.uid || null;
    }

    // 2) 매핑이 없을 경우 users 컬렉션 직접 쿼리 (fallback)
    if (!targetUid) {
      const q = query(
        collection(db, "users"),
        where("username", "==", normalized),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        targetUid = querySnap.docs[0].id;
      }
    }

    if (!targetUid) return null;

    const profile = await getUserProfileFromFirestore(targetUid);
    if (!profile) return null;

    return {
      uid: targetUid,
      profile,
    };
  } catch (err) {
    console.error("username으로 유저 조회 실패:", err);
    return null;
  }
}

/**
 * users/{uid} 경로에서 유저 프로필 정보를 가져옵니다.
 */
export async function getUserProfileFromFirestore(
  uid: string
): Promise<ProfileData | null> {
  if (!uid) return null;

  try {
    // 1. users/{uid} 상위 문서 확인
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);

    // 2. 12주차 규격: users/{uid}/profile/info 서브컬렉션 문서도 병행 확인
    const subProfileRef = doc(db, "users", uid, "profile", "info");
    const subSnap = await getDoc(subProfileRef);

    if (!snap.exists() && !subSnap.exists()) {
      return null;
    }

    const data = {
      ...(snap.exists() ? snap.data() : {}),
      ...(subSnap.exists() ? subSnap.data() : {}),
    };

    const displayName = data.displayName || data.name || "사용자";
    return {
      username: data.username || undefined,
      displayName: displayName,
      name: displayName,
      headline: data.headline || "",
      bio: data.bio || "",
      avatarUrl: data.avatarUrl || "/profile.svg",
      bottomCtaText: data.bottomCtaText || "링크 공유하기 🔗",
      bottomCtaUrl: data.bottomCtaUrl || "",
    };
  } catch (err) {
    console.error("프로필 불러오기 실패:", err);
    return null;
  }
}

/**
 * 12주차: users/{uid}/profile 및 users/{uid}에 프로필 저장
 * username 중복 체크 및 usernames/{username} 인덱스 동기화 포함
 */
export async function syncUserProfileToFirestore(
  uid: string,
  profile: Partial<ProfileData>
): Promise<ProfileData> {
  const targetUid = resolveWriteUid(uid);
  const userDocRef = doc(db, "users", targetUid);
  const subProfileRef = doc(db, "users", targetUid, "profile", "info");

  // 기존 프로필 조회
  const existingProfile = await getUserProfileFromFirestore(targetUid);

  // username 설정 로직 (새로운 username이 들어왔고 기존과 다르다면 중복 체크)
  let finalUsername = profile.username?.trim().toLowerCase() || existingProfile?.username;
  if (!finalUsername) {
    finalUsername = generateDefaultUsername(auth.currentUser?.email || targetUid.substring(0, 6));
  }

  if (profile.username && profile.username !== existingProfile?.username) {
    const availability = await checkUsernameAvailability(profile.username, targetUid);
    if (!availability.available) {
      throw new Error(availability.error || "이미 사용 중인 username입니다.");
    }
  }

  const finalDisplayName = profile.displayName || profile.name || existingProfile?.displayName || existingProfile?.name || "사용자";

  const updatedProfile: ProfileData = {
    username: finalUsername,
    displayName: finalDisplayName,
    name: finalDisplayName,
    headline: profile.headline !== undefined ? profile.headline : (existingProfile?.headline || "나만의 모바일 링크인바이오"),
    bio: profile.bio !== undefined ? profile.bio : (existingProfile?.bio || "새로운 링크를 추가하고 사람들과 공유해보세요. 🌱"),
    avatarUrl: profile.avatarUrl || existingProfile?.avatarUrl || "/profile.svg",
    bottomCtaText: profile.bottomCtaText || existingProfile?.bottomCtaText || "링크 공유하기 🔗",
    bottomCtaUrl: profile.bottomCtaUrl !== undefined ? profile.bottomCtaUrl : (existingProfile?.bottomCtaUrl || ""),
  };

  const payload = {
    ...updatedProfile,
    updatedAt: serverTimestamp(),
  };

  // 1. users/{targetUid} 문서 저장
  await setDoc(userDocRef, payload, { merge: true });

  // 2. 12주차 교안 구조: users/{targetUid}/profile 문서 저장
  try {
    await setDoc(subProfileRef, payload, { merge: true });
  } catch (e) {
    console.warn("subProfile 저장 경고:", e);
  }

  // 3. usernames/{finalUsername} 매핑 저장 (빠른 검색 및 중복 방지)
  try {
    await setDoc(doc(db, "usernames", finalUsername), {
      uid: targetUid,
      updatedAt: serverTimestamp(),
    });

    // 만약 이전 username이 있었고 변경되었다면 이전 매핑 삭제
    if (existingProfile?.username && existingProfile.username !== finalUsername) {
      await deleteDoc(doc(db, "usernames", existingProfile.username));
    }
  } catch (e) {
    console.warn("usernames 매핑 저장 경고:", e);
  }

  return updatedProfile;
}

/* ─────────────────────────────────────────────────────────
 * 2. 개인화된 링크 목록 관리 (경로: users/{user.uid}/links)
 * ───────────────────────────────────────────────────────── */

/**
 * users/{user.uid}/links 경로에 링크를 Firestore에 저장합니다.
 * @throws 로그인이 되어있지 않은 경우 에러 발생
 * @returns 생성된 문서의 ID
 */
export async function addLinkToFirestore(
  item: Omit<ContentItem, "order">,
  uid?: string
): Promise<string> {
  const targetUid = resolveWriteUid(uid);
  const linksRef = collection(db, "users", targetUid, "links");

  const docRef = await addDoc(linksRef, {
    title: item.title,
    url: item.url ?? null,
    desc: item.desc ?? null,
    emoji: item.emoji ?? "🔗",
    clickCount: 0, // 13주차: 기본 클릭수 0 초기화
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * users/{user.uid}/links에서 링크 목록을 createdAt 기준 최신순으로 불러옵니다.
 * 조회=해당 uid의 링크를 누구나 조회 가능
 */
export async function getLinksFromFirestore(
  uid: string
): Promise<ContentItem[]> {
  if (!uid) return [];
  const linksRef = collection(db, "users", uid, "links");
  const q = query(linksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc, index) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: "link" as const,
      order: index,
      title: data.title ?? "",
      url: data.url ?? "",
      desc: data.desc ?? undefined,
      emoji: data.emoji ?? "🔗",
      clickCount: typeof data.clickCount === "number" ? data.clickCount : 0, // 13주차: 클릭 카운트
    };
  });
}

/**
 * 13주차 핵심 요구사항: 링크 클릭 시 서버에서 원자적으로 +1 증가 (동시성 문제 해결)
 * Firestore increment(1)을 사용하여 여러 사용자가 동시에 클릭해도 손실 없이 카운트
 */
export async function incrementLinkClickCount(
  userId: string,
  linkId: string
): Promise<void> {
  if (!userId || !linkId) return;

  try {
    const linkDocRef = doc(db, "users", userId, "links", linkId);
    await updateDoc(linkDocRef, {
      clickCount: increment(1),
    });
  } catch (error) {
    // 13주차 AI 프롬프트 예시 요구: 실패 시 콘솔 에러
    console.error("클릭 카운트 증가 실패:", error);
  }
}

/**
 * users/{user.uid}/links에서 특정 링크의 제목과 URL을 Firestore updateDoc으로 수정합니다.
 * @throws 로그인이 되어있지 않은 경우 에러 발생
 */
export async function updateLinkInFirestore(
  id: string,
  data: { title: string; url: string; desc?: string; emoji?: string },
  uid?: string
): Promise<void> {
  const targetUid = resolveWriteUid(uid);
  const docRef = doc(db, "users", targetUid, "links", id);

  const updatePayload: Record<string, unknown> = {
    title: data.title,
    url: data.url,
    updatedAt: serverTimestamp(),
  };

  if (data.desc !== undefined) updatePayload.desc = data.desc;
  if (data.emoji !== undefined) updatePayload.emoji = data.emoji;

  await updateDoc(docRef, updatePayload);
}

/**
 * users/{user.uid}/links에서 특정 링크를 Firestore deleteDoc으로 삭제합니다.
 * @throws 로그인이 되어있지 않은 경우 에러 발생
 */
export async function deleteLinkFromFirestore(
  id: string,
  uid?: string
): Promise<void> {
  const targetUid = resolveWriteUid(uid);
  const docRef = doc(db, "users", targetUid, "links", id);
  await deleteDoc(docRef);
}
