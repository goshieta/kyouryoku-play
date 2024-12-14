import { Client } from "@notionhq/client";

const getDatabaseTags = async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = "15542357ea2180b9b26ce8e1d0fa8cfa"!;

  try {
    // データベースのプロパティを取得
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    // "タグ"という名前のプロパティを探す
    const tagsProperty = database.properties["タグ"];

    if (!tagsProperty || tagsProperty.type !== "multi_select") {
      throw new Error(
        'The "タグ" property is not a multi-select type or does not exist.'
      );
    }

    // マルチセレクトオプションを取得
    const tagOptions = tagsProperty.multi_select.options;

    // オプションを抽出して一覧として返す
    const tagNames = tagOptions.map((option) => option.name);

    return tagNames;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};
export default getDatabaseTags;
