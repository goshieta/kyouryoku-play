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
  const result = await getPageByID(params.articleid);
  if (result === null)
    return (
      <div id={styles.unknown}>
        <h1>404 : 存在しない記事</h1>
        <p>
          存在しない記事にアクセスしました。URLが間違っているか、すでに記事が削除されている可能性あります。
        </p>
        <Link href="/blog">ブログの記事一覧へ</Link>
      </div>
    );
  const { content, ...articleData } = result;

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

  const publishedDate = new Date(articleData.publishedTime);

  return (
    <div id={styles.article_page}>
      <div id={styles.article_header}>
        <div id={styles.back_button_area}>
          <Link href={"/blog"} id={styles.back_button}>
            <span className="material-symbols-outlined">arrow_back</span>
            <p>戻る</p>
          </Link>
        </div>
        <img
          src={articleData.imgurl}
          alt={`${articleData.title}の画像`}
          width={800}
          id={styles.title_img}
        />
        <h1 id={styles.title}>{articleData.title}</h1>
        <div id={styles.article_detail_area}>
          <div id={styles.tag_area}>
            {articleData.tags.map((tag: any) => {
              return (
                <Link href={`/blog?tag=${tag.name}`} key={tag.id}>
                  <span className="material-symbols-outlined">label</span>
                  {tag.name}
                </Link>
              );
            })}
          </div>
          <div className={styles.date_area}>
            <span className="material-symbols-outlined">calendar_month</span>
            <p>
              公開日 : {publishedDate.getFullYear()}年
              {publishedDate.getMonth() + 1}月{publishedDate.getDate()}日
            </p>
          </div>
          <div className={styles.date_area}>
            <span className="material-symbols-outlined">history</span>
            <p>最終更新 : {resultString}前</p>
          </div>
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
