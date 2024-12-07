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

  let resultString = "";
  (() => {
    //最終更新日時を現在から起算して計算
    const now = new Date();
    const lastEditedTime = new Date(articleData.lastEditedTime);
    const diff = Math.floor((now.getTime() - lastEditedTime.getTime()) / 1000);
    const seconds = diff % 60;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const month = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years != 0) resultString = years + "年";
    else if (month != 0) resultString = month + "ヵ月";
    else if (days != 0) resultString = days + "日";
    else if (hours != 0) resultString = hours + "時間";
    else if (minutes != 0) resultString = minutes + "分";
    else resultString = seconds + "秒";
  })();

  return (
    <div id={styles.article_page}>
      <img
        src={articleData.imgurl}
        alt={`${articleData.title}の画像`}
        width={800}
        id={styles.title_img}
      />
      <h1 id={styles.title}>{articleData.title}</h1>
      <div>
        <div id={styles.tag_area}>
          {articleData.tags.map((tag: any) => {
            return (
              <Link href={`/blog?tag=${tag.id}`} key={tag.id}>
                {tag.name}
              </Link>
            );
          })}
        </div>
        <div>
          <p>公開日 : {articleData.publishedTime}</p>
          <p>最終更新 : {resultString}前</p>
        </div>
      </div>
      <div id={styles.content_area}>
        {content.map((oneContent) => {
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
