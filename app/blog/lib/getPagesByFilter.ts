import { Client } from "@notionhq/client";

export default async function getPagesByFilter() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const databaseId = process.env.NOTION_DATABASE_ID!;
  const responce = await notion.databases.query({
    database_id: databaseId,
  });

  return responce.results;
}
