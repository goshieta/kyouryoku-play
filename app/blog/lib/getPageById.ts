import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default async function getPageByID(id: string) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const data = (await notion.pages.retrieve({
    page_id: id,
  })) as PageObjectResponse;
  const content = (await notion.blocks.children.list({ block_id: id })).results;

  const properties = data.properties;

  const title = (properties["記事タイトル"] as any).title[0].plain_text;
  const description = (properties["記事説明"] as any).rich_text[0].plain_text;
  const imgurl = (properties["タイトル画像"] as any).files[0].file.url;
  const tags = (properties["タグ"] as any).multi_select;

  return {
    title,
    description,
    imgurl,
    tags,
    content,
  };
}
