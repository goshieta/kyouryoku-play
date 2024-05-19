import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/client";
import { isTagType } from "../types/communityType";

export default async function getTrend(count: number): Promise<string[]> {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  const docs = await getDocs(
    query(
      collection(db, "tags"),
      orderBy("trendIndex", "desc"),
      where("latestTimestamp", ">", now.getTime()),
      limit(count)
    )
  );
  return docs.docs
    .map((oneData) => oneData.data())
    .filter((oneData) => isTagType(oneData))
    .map((oneTag) => oneTag.name);
}
