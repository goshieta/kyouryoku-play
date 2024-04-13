import Articles from "@/components/world/top/articles";
import styles from "@/styles/world/world.module.css";
import { useRouter } from "next/router";
import {
  JSXElementConstructor,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import WorldLayout, {
  CurrentTagContext,
} from "@/components/layouts/worldLayout";
import Link from "next/link";
import Head from "next/head";

export default function World() {
  const router = useRouter();
  const [trendingTag, setTrendingTag] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/getTrend")
      .then((data) => data.text())
      .then((txt) => {
        const trend = JSON.parse(txt);
        trend.length = 5;
        setTrendingTag(trend);
      });
  }, []);
  const currentTag = useContext(CurrentTagContext);

  return (
    <div id={styles.parent}>
      <Head>
        <title>{`${
          !currentTag?.currentTag ? "すべて" : currentTag?.currentTag
        }の投稿 - 峡緑プレイ`}</title>
      </Head>
      <div id={styles.leftItem}>
        <button
          id={styles.createNew}
          className={styles.leftButton}
          onClick={() => router.push("/world/new")}
        >
          <span className="material-symbols-outlined">article</span>投稿
        </button>
        <div id={styles.linkArea}>
          <Link
            id={styles.all}
            href={`/world?q=すべて`}
            className={
              currentTag?.currentTag === "すべて" ? styles.tagCurrent : ""
            }
          >
            <span className="material-symbols-outlined">home</span>すべて
          </Link>
          {trendingTag.map((oneTag) => (
            <Link
              key={oneTag}
              href={`/world?q=${oneTag}`}
              className={
                currentTag?.currentTag === oneTag ? styles.tagCurrent : ""
              }
            >
              <span className="material-symbols-outlined">trending_up</span>
              {oneTag}
            </Link>
          ))}
        </div>
      </div>
      <Articles
        query={currentTag?.currentTag ? currentTag?.currentTag : "すべて"}
      />
    </div>
  );
}

World.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <WorldLayout>{page}</WorldLayout>;
};
