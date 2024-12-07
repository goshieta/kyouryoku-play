import Link from "next/link";
import getPageByID from "../lib/getPageById";
import ArticleBlock from "../components/articleBlock";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "./style.module.css";

export default async function Article({
  params,
}: {
  params: { articleid: string };
}) {
  const { content, ...articleData } = await getPageByID(params.articleid);

  return (
    <div id={styles.article_page}>
      <img
        src={articleData.imgurl}
        alt={`${articleData.title}の画像`}
        width={800}
        id={styles.title_img}
      />
      <h1 id={styles.title}>{articleData.title}</h1>
      <div id={styles.tag_area}>
        {articleData.tags.map((tag: any) => {
          return (
            <Link href={`/blog?tag=${tag.id}`} key={tag.id}>
              {tag.name}
            </Link>
          );
        })}
      </div>
      <div id={styles.content_area}>
        {content.map((oneContent) => {
          console.log(oneContent);
          return (
            <ArticleBlock
              data={oneContent as BlockObjectResponse}
              key={oneContent.id}
            />
          );
        })}
      </div>
      <div></div>
    </div>
  );
}
