import { Client } from "@notionhq/client";

export default async function getPagesByFilter(
  tag: string | undefined,
  limit?: number
) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const databaseId = "15542357ea2180b9b26ce8e1d0fa8cfa"!;
  const responce = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "公開日",
        direction: "descending",
      },
    ],
    filter: {
      and: [
        {
          property: "公開状態",
          select: {
            equals: "公開",
          },
        },
        ...(tag
          ? [
              {
                property: "タグ",
                multi_select: {
                  contains: tag,
                },
              },
            ]
          : []),
      ],
    },
    ...(limit
      ? {
          page_size: limit,
        }
      : {}),
  });

  return responce.results;
}
