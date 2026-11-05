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
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
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

/* ─────────────────────────────────────────────────────────
 * 1. 유저 프로필 관리 (경로: users/{uid})
 * ───────────────────────────────────────────────────────── */

/**
 * users/{uid} 경로에서 유저 프로필 정보를 가져옵니다.
 */
export async function getUserProfileFromFirestore(
  uid: string
): Promise<ProfileData | null> {
  if (!uid) return null;
  const userDocRef = doc(db, "users", uid);
  const snap = await getDoc(userDocRef);

  if (!snap.exists()) {
    return null;
  }

  const data = snap.data();
  return {
    name: data.name || "사용자",
    headline: data.headline || "",
    bio: data.bio || "",
    avatarUrl: data.avatarUrl || "/profile.svg",
    bottomCtaText: data.bottomCtaText || "링크 공유하기 🔗",
    bottomCtaUrl: data.bottomCtaUrl || "",
  };
}

/**
 * users/{uid} 경로에 유저 프로필 정보를 저장/동기화합니다.
 */
export async function syncUserProfileToFirestore(
  uid: string,
  profile: Partial<ProfileData>
): Promise<ProfileData> {
  const targetUid = resolveWriteUid(uid);
  const userDocRef = doc(db, "users", targetUid);

  const snap = await getDoc(userDocRef);
  let updatedProfile: ProfileData;

  if (snap.exists()) {
    const existing = snap.data() as ProfileData;
    updatedProfile = {
      ...existing,
      ...profile,
      name: profile.name || existing.name || "사용자",
      avatarUrl: profile.avatarUrl || existing.avatarUrl || "/profile.svg",
    };
    await updateDoc(userDocRef, {
      ...updatedProfile,
      updatedAt: serverTimestamp(),
    });
  } else {
    updatedProfile = {
      name: profile.name || "사용자",
      headline: profile.headline || "나만의 모바일 링크인바이오",
      bio: profile.bio || "새로운 링크를 추가하고 사람들과 공유해보세요. 🌱",
      avatarUrl: profile.avatarUrl || "/profile.svg",
      bottomCtaText: profile.bottomCtaText || "링크 공유하기 🔗",
      bottomCtaUrl: profile.bottomCtaUrl || "",
    };
    await setDoc(userDocRef, {
      ...updatedProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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
    };
  });
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
