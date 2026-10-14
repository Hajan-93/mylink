import { app } from "@/lib/firebase";
import {
  getFirestore,
  collection,
  addDoc,
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
