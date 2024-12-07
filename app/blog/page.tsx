import { Metadata } from "next";
import getPagesByFilter from "./lib/getPagesByFilter";
import PageTile from "./components/pageTile";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "./style.module.css";

export const metadata: Metadata = {
  title: "ブログ - 峡緑プレイ",
};

export default async function Blog() {
  const pages = await getPagesByFilter();
  return (
    <div id={styles.results_page}>
      <div id={styles.article_grid}>
        {pages.map((onePage) => (
          <PageTile data={onePage as PageObjectResponse} key={onePage.id} />
        ))}
      </div>
    </div>
  );
}
