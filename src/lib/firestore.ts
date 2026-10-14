import { app } from "@/lib/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ContentItem } from "@/types";

const db = getFirestore(app);

/**
 * users/anonymous/links 경로에 링크를 Firestore에 저장합니다.
 * @returns 생성된 문서의 ID
 */
export async function addLinkToFirestore(
  item: Omit<ContentItem, "order">
): Promise<string> {
  const linksRef = collection(db, "users", "anonymous", "links");

  const docRef = await addDoc(linksRef, {
    title: item.title,
    url: item.url ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * users/anonymous/links에서 링크 목록을 createdAt 기준 최신순으로 불러옵니다.
 */
export async function getLinksFromFirestore(): Promise<ContentItem[]> {
  const linksRef = collection(db, "users", "anonymous", "links");
  const q = query(linksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc, index) => ({
    id: doc.id,
    type: "link" as const,
    order: index,
    title: doc.data().title ?? "",
    url: doc.data().url ?? "",
  }));
}
