import {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import styles from "./block.module.css";
import Link from "next/link";

export default function ArticleBlock({ data }: { data: BlockObjectResponse }) {
  switch (data.type) {
    case "paragraph":
      return (
        <p>
          {data.paragraph.rich_text.map((txt) => (
            <RichText txt={txt} key={txt.plain_text} />
          ))}
        </p>
      );
    case "bulleted_list_item":
      return (
        <li>
          {data.bulleted_list_item.rich_text.map((txt) => (
            <RichText txt={txt} key={txt.plain_text} />
          ))}
        </li>
      );
    case "callout":
      return (
        <p className={styles.callout}>
          {data.callout.rich_text.map((txt) => (
            <RichText txt={txt} key={txt.plain_text} />
          ))}
        </p>
      );
    case "bookmark":
      return (
        <Link
          href={data.bookmark.url}
          className={styles.bookmark}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.bookmark.caption.map((cap) => (
            <p key={cap.plain_text}>{cap.plain_text}</p>
          ))}
        </Link>
      );
  }
}

function RichText({ txt }: { txt: RichTextItemResponse }) {
  if (txt.href)
    return (
      <Link
        href={txt.href[0] === "/" ? "/blog/" + txt.href : txt.href}
        target="_blank"
        rel="noopener noreferrer"
        className={txt.annotations.bold ? styles.bold : ""}
      >
        {txt.plain_text}
      </Link>
    );
  else
    return (
      <span className={txt.annotations.bold ? styles.bold : ""}>
        {txt.plain_text}
      </span>
    );
}
