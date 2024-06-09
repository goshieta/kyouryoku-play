import useMessage from "@/components/tips/useMessage";
import SendButton from "@/components/world/new/sendButton";
import TagInput from "@/components/world/new/tagInput";
import OneArticle from "@/components/world/top/oneArticle";
import { db } from "@/lib/firebase/client";
import { isOneArticleType, oneArticleType } from "@/lib/types/communityType";
import styles from "@/styles/world/new/post.module.css";
import { collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NewReply() {
  const [show, Message] = useMessage();
  const [inputValue, setInputValue] = useState<{
    tags: string[];
    body: string;
  }>({ tags: [], body: "" });
  const [replyTarget, setReplyTarget] = useState<oneArticleType | undefined>(
    undefined
  );
  const rooter = useRouter();

  // 返信対象を取得
  useEffect(() => {
    console.log(rooter.query.target);
    const docID = rooter.query.target?.toString();
    if (docID === undefined) return;
    getDoc(doc(collection(db, "world"), docID)).then((doc) => {
      if (isOneArticleType(doc.data())) {
        setReplyTarget(doc.data() as oneArticleType);
      } else {
        show("error", "不正なURLです。");
      }
    });
  }, [rooter]);

  return (
    <div id={styles.post}>
      <Message />
      <h1>返信</h1>
      {replyTarget && (
        <div id={styles.replyTarget}>
          <OneArticle
            article={replyTarget}
            usersInfo={{}}
            setUsersInfo={() => {}}
            isNoQuote={true}
          />
        </div>
      )}
      <TagInput
        tags={inputValue.tags}
        setTags={(newVal) => setInputValue({ ...inputValue, tags: newVal })}
        show={show}
      />
      <div id={styles.textAreaParent}>
        <textarea
          placeholder="内容を入力"
          value={inputValue.body}
          onChange={(e) => {
            if (e.target.value.length > 200) {
              show("error", "200文字までしか入力できません。");
              return;
            }
            setInputValue({ ...inputValue, body: e.target.value });
          }}
          id={styles.bodyInputArea}
        />
        <p id={styles.textAreaCount}>{`${inputValue.body.length}/200文字`}</p>
      </div>
      {replyTarget && (
        <SendButton
          type="reply"
          show={show}
          inputValue={inputValue}
          targetValue={{
            target: replyTarget?.id,
            targetUser: replyTarget.user,
            targetBody: replyTarget.body,
            targetTitle: null,
          }}
          setInputValue={setInputValue}
        />
      )}
    </div>
  );
}
