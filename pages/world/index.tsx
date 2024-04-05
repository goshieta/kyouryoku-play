import Articles from "@/components/world/top/articles";
import Query from "@/components/world/top/query";
import styles from "@/styles/world/world.module.css";
import { useRouter } from "next/router";
import { useQueryState } from "next-usequerystate";
import { useEffect } from "react";

export default function World() {
  const router = useRouter();
  const [currentTag, setCurrentTag] = useQueryState("q");
  useEffect(() => {
    if (!currentTag) setCurrentTag("すべて");
  }, [currentTag]);

  return (
    <div id={styles.parent}>
      <button onClick={() => router.push("/world/new")} id={styles.createNew}>
        投稿を作成
      </button>
      <Query
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
        router={router}
      />
      <Articles query={currentTag} />
    </div>
  );
}
