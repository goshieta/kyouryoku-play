import Articles from "@/components/world/top/articles";
import Query from "@/components/world/top/query";
import styles from "@/styles/world/world.module.css";
import { useRouter } from "next/router";
import { useQueryState } from "next-usequerystate";
import { JSXElementConstructor, ReactElement, useEffect } from "react";

export default function World() {
  const router = useRouter();
  const [currentTag, setCurrentTag] = useQueryState("q");
  useEffect(() => {
    if (!currentTag) setCurrentTag("すべて");
  }, [currentTag]);

  return (
    <div id={styles.parent}>
      <div id={styles.leftItem}>
        <Query
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
          router={router}
        />
      </div>
      <Articles query={currentTag} />
      <button id={styles.createNew} onClick={() => router.push("/world/new")}>
        <span className="material-symbols-outlined">article</span>投稿
      </button>
    </div>
  );
}

World.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <>{page}</>;
};
