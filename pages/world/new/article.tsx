import NoneHeaderFooterLayout from "@/components/layouts/noneHeaderFooterLayout";
import useMessage from "@/components/tips/useMessage";
import ArticleEditor from "@/components/world/new/editor/articleEditor";
import TagInput from "@/components/world/new/tagInput";
import styles from "@/styles/world/new/article.module.css";
import { JSXElementConstructor, ReactElement, useState } from "react";

export default function NewArticle() {
  const [show, Message] = useMessage();
  const [data, setData] = useState<{
    title: string;
    tags: string[];
    body: string;
  }>({ title: "", tags: [], body: "" });

  return (
    <div id={styles.article}>
      <Message />
      <input type="text" placeholder="タイトルを入力" id={styles.inputTitle} />
      <div id={styles.tagInputArea}>
        <TagInput
          show={show}
          tags={data.tags}
          setTags={(newTags) => {
            setData({ ...data, tags: newTags });
          }}
        />
      </div>
      <ArticleEditor />
    </div>
  );
}

NewArticle.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <NoneHeaderFooterLayout>{page}</NoneHeaderFooterLayout>;
};
