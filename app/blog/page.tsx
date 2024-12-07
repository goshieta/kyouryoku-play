import { Metadata } from "next";
import getPagesByFilter from "./lib/getPagesByFilter";
import PageTile from "./components/pageTile";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const metadata: Metadata = {
  title: "ブログ - 峡緑プレイ",
};

export default async function Blog() {
  const pages = await getPagesByFilter();
  return (
    <div>
      {pages.map((onePage) => (
        <PageTile data={onePage as PageObjectResponse} key={onePage.id} />
      ))}
    </div>
  );
}
