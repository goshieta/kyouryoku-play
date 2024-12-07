import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export default function PageTile({ data }: { data: PageObjectResponse }) {
  const properties = data.properties;
  console.log(data);

  const title = (properties["記事タイトル"] as any).title[0].plain_text;
  const description = (properties["記事説明"] as any).rich_text[0].plain_text;
  const imgurl = (properties["タイトル画像"] as any).files[0].file.url;

  return (
    <div>
      <img src={imgurl} alt={`${title}の記事画像`} width={300} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
