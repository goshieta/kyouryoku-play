import { db } from "@/lib/firebase/client";
import { isOneArticleType, oneArticleType } from "@/lib/types/communityType";
import styles from "@/styles/world/world.module.css";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Articles({ query }: { query: string | null }) {
  const [arts, setArts] = useState<oneArticleType[] | undefined>(undefined);

  useEffect(() => {
    //記事を取得
    const queryEffect = async () => {
      setArts(await getArticleFromQuery(query));
    };
    queryEffect();
  }, [query]);

  return <div id={styles.articles}></div>;
}

//クエリから記事を取得
async function getArticleFromQuery(
  tag: string | null
): Promise<oneArticleType[]> {
  const newArticle: oneArticleType[] = [];
  const thisQuery = tag
    ? query(
        collection(db, "world"),
        where("tags", "array-contains", tag),
        orderBy("createdAt", "desc"),
        limit(20)
      )
    : query(collection(db, "world"), orderBy("createdAt", "desc"), limit(20));
  const docs = await getDocs(thisQuery);
  docs.forEach((oneDoc) => {
    const data = oneDoc.data();
    if (isOneArticleType(data)) {
      newArticle.push(data);
    }
  });
  return newArticle;
}
