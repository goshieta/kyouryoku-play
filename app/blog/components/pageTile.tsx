import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Link from "next/link";
import styles from "../style.module.css";

export default function PageTile({ data }: { data: PageObjectResponse }) {
  const properties = data.properties;

  const title = (properties["記事タイトル"] as any).title[0].plain_text;
  const description = (properties["記事説明"] as any).rich_text[0].plain_text;
  const imgurl = (properties["タイトル画像"] as any).files[0].file.url;
  const publishedTime = (properties["公開日"] as any).date?.start;
  const publishedDate = new Date(publishedTime);

  return (
    <Link href={`/blog/${data.id}`} className={styles.article}>
      <div className={styles.img_box}>
        <img
          src={imgurl}
          alt={`${title}の記事画像`}
          width={300}
          className={styles.article_img}
        />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.published_date}>
        <span className="material-symbols-outlined">calendar_month</span>
        公開日 : {publishedDate.getFullYear()}年{publishedDate.getMonth() + 1}月
        {publishedDate.getDate()}日
      </p>
      <p className={styles.description}>{description}</p>
    </Link>
  );
}
