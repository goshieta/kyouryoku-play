import { Client } from "@notionhq/client";
import {
  GetPageResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export default async function getPageByID(id: string) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const promiseArray = [
    notion.pages.retrieve({
      page_id: id,
    }),
    notion.blocks.children.list({ block_id: id }),
  ];
  const resolvePromiseArray = (await Promise.all(promiseArray)) as [
    GetPageResponse,
    ListBlockChildrenResponse
  ];

  const data = resolvePromiseArray[0] as PageObjectResponse;
  const content = resolvePromiseArray[1].results;

  const properties = data.properties;

  const title = (properties["記事タイトル"] as any).title[0].plain_text;
  const description = (properties["記事説明"] as any).rich_text[0].plain_text;
  const imgurl = (properties["タイトル画像"] as any).files[0].file.url;
  const tags = (properties["タグ"] as any).multi_select;
  const lastEditedTime = (properties["更新日時"] as any).last_edited_time;
  const publishedTime = (properties["公開日"] as any).date?.start;

  return {
    title,
    description,
    imgurl,
    tags,
    lastEditedTime,
    publishedTime,
    content,
  };
}