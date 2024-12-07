import { Metadata } from "next";
import getPagesByFilter from "./lib/getPagesByFilter";
import PageTile from "./components/pageTile";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import styles from "./style.module.css";
import getDatabaseTags from "./lib/getTags";
import Link from "next/link";

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { tag: string | undefined };
}): Promise<Metadata> => {
  return {
    title:
      (searchParams.tag ? `${searchParams.tag}の記事一覧` : "すべての記事") +
      " - 峡緑プレイ",
  };
};

export default async function Blog({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tag =
    typeof searchParams["tag"] === "string" ? searchParams["tag"] : undefined;
  const [pages, tags] = (await Promise.all([
    getPagesByFilter(tag),
    getDatabaseTags(),
  ])) as [
    (
      | PageObjectResponse
      | PartialPageObjectResponse
      | PartialDatabaseObjectResponse
      | DatabaseObjectResponse
    )[],
    string[]
  ];

  return (
    <div id={styles.results_page}>
      <div id={styles.page_title}>
        <h1>{tag ? tag + "の記事" : "すべての記事"}</h1>
      </div>
      <div id={styles.tags}>
        <Link href={`/blog`}>すべて</Link>
        {tags.map((oneTag) => (
          <Link href={`/blog?tag=${oneTag}`} key={oneTag}>
            {oneTag}
          </Link>
        ))}
      </div>
      <div id={styles.article_grid}>
        {pages.map((onePage) => (
          <PageTile data={onePage as PageObjectResponse} key={onePage.id} />
        ))}
      </div>
    </div>
  );
}
