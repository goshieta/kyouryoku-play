import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./client";

export default async function setNgram(
  targetDocumentName: string,
  targetCollectionName: string,
  targetStr: string[]
) {
  //targetDocumentnameは格納するドキュメントの名前
  //targetCollectionNameは格納するコレクションの名前
  //targetStrは検索対象の文字列
  //bi-gramで実装
  let divideTargetStr: { [key: string]: true } = {};
  targetStr.forEach((oneStr) => {
    for (let i = 0; i < oneStr.length - 1; i++) {
      divideTargetStr[oneStr[i] + oneStr[i + 1]] = true;
    }
  });
  await setDoc(doc(db, targetCollectionName, targetDocumentName), {
    tokenMap: divideTargetStr,
  });
}

export async function searchNgram(
  searchStr: string,
  targetCollectionName: string
) {
  //searchStrは検索のクエリ
  //targetCollectionNameは検索する対象のコレクション
  let divideSearchStr = [];
  for (let i = 0; i < searchStr.length - 1; i++) {
    divideSearchStr.push([searchStr[i] + searchStr[i + 1]]);
  }
  const wheres = divideSearchStr.map((word) =>
    where(`tokenMap.${word}`, "==", true)
  );
  const docs = await getDocs(
    query(collection(db, targetCollectionName), ...wheres, limit(20))
  );
  let docsId: string[] = [];
  docs.forEach((oneDoc) => docsId.push(oneDoc.id));
  return docsId;
}
