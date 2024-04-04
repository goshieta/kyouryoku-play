import { oneArticleType } from "@/lib/types/communityType";
import styles from "@/styles/world/world.module.css";
import { useEffect, useState } from "react";

export default function Articles({ query }: { query: string | null }) {
  const [arts, setArts] = useState<oneArticleType[] | undefined>(undefined);

  useEffect(() => {
    //記事を取得
  }, [query]);

  return <div id={styles.articles}></div>;
}

//クエリから記事を取得
function getArticleFromQuery(query: string): oneArticleType[] {
  const newArticle: oneArticleType[] = [];
  return newArticle;
}
