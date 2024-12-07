import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default function ArticleBlock({ data }: { data: BlockObjectResponse }) {
  console.log(data.type);
  switch (data.type) {
    case "paragraph":
      return <p>{data.paragraph.rich_text[0].plain_text}</p>;
    case "bulleted_list_item":
      return <li>{data.bulleted_list_item.rich_text[0].plain_text}</li>;
  }
}
