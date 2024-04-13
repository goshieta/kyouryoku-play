import Articles from "@/components/world/top/articles";
import styles from "@/styles/world/world.module.css";
import { useRouter } from "next/router";
import { useQueryState } from "next-usequerystate";
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import WorldLayout from "@/components/layouts/worldLayout";
import Link from "next/link";
import Head from "next/head";

export default function World() {
  const router = useRouter();
  const [currentTag, setCurrentTag] = useQueryState("q");
  useEffect(() => {
    if (!currentTag) setCurrentTag("すべて");
  }, [currentTag]);
  const [trendingTag, setTrendingTag] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/getTrend")
      .then((data) => data.text())
      .then((txt) => {
        const trend = JSON.parse(txt);
        trend.length = 10;
        setTrendingTag(trend);
      });
  }, []);

  return (
    <div id={styles.parent}>
      <Head>
        <title>{`${currentTag}の投稿 - 峡緑プレイ`}</title>
      </Head>
      <div id={styles.leftItem}>
        <button id={styles.createNew} onClick={() => router.push("/world/new")}>
          <span className="material-symbols-outlined">article</span>投稿
        </button>
        <div id={styles.trend}>
          {trendingTag.map((oneTag) => (
            <Link key={oneTag} href={`/world?q=${oneTag}`}>
              <span className="material-symbols-outlined">trending_up</span>
              {oneTag}
            </Link>
          ))}
        </div>
      </div>
      <Articles query={currentTag} />
    </div>
  );
}

World.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <WorldLayout>{page}</WorldLayout>;
};
