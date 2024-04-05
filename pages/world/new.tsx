import { useAuth } from "@/components/context/auth";
import useMessage, { showFunctionType } from "@/components/tips/useMessage";
import { db } from "@/lib/firebase/client";
import { oneArticleType, userType } from "@/lib/types/communityType";
import createUUID from "@/lib/uuid";
import styles from "@/styles/world/new.module.css";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";

type formArticleType = {
  title: string;
  tags: string;
  body: string;
};

export default function NewArticle() {
  const [inputValue, setInputValue] = useState<formArticleType>({
    title: "",
    tags: "",
    body: "",
  });
  const [show, Message] = useMessage();
  const auth = useAuth();
  const router = useRouter();

  return (
    <div id={styles.parent}>
      <Message />
      <h1>投稿する</h1>
      <div id={styles.inputArea}>
        <div id={styles.inputTitleArea}>
          <label htmlFor="">タイトル</label>
          <input
            type="text"
            value={inputValue.title}
            placeholder="タイトルを入力"
            onChange={(e) =>
              setInputValue({ ...inputValue, title: e.target.value })
            }
          />
        </div>
        <div id={styles.inputTagArea}>
          <label htmlFor="">タグ　　</label>
          <input
            type="text"
            placeholder="スペースで区切って入力"
            value={inputValue.tags}
            onChange={(e) => {
              setInputValue({
                ...inputValue,
                tags: e.target.value,
              });
            }}
          />
        </div>
        <div id={styles.InputBodyArea}>
          <textarea
            placeholder="ここに内容を入力"
            value={inputValue.body}
            onChange={(e) =>
              setInputValue({ ...inputValue, body: e.target.value })
            }
          ></textarea>
        </div>
      </div>
      <div>
        <button
          onClick={async () => {
            if (auth) {
              const result = await postArticle(inputValue, show, auth);
              if (result === true) {
                setInputValue({ title: "", tags: "", body: "" });
                router.push("/world");
              }
            } else show("error", "投稿するにはログインしてください。");
          }}
        >
          投稿
        </button>
      </div>
    </div>
  );
}

async function postArticle(
  postValue: formArticleType,
  show: showFunctionType,
  auth: userType
): Promise<boolean> {
  //postValueを投稿してもいい値か判断する
  if (
    postValue.title.trim() === "" ||
    postValue.tags.trim() === "" ||
    postValue.body.trim() === ""
  ) {
    show("error", "内容が空の項目が存在します");
    return false;
  } else if (postValue.body.trim().length > 2000) {
    show("error", "本文が長すぎます。1000文字以下にしてください。");
    return false;
  } else if (postValue.title.trim().length > 30) {
    show("error", "タイトルが長すぎます。30文字以下にしてください。");
    return false;
  } else if (
    postValue.tags
      .split(/( |　)/)
      .map((val) => val.replaceAll(/(#|＃)/gi, ""))
      .filter((val) => val !== "" && val !== " " && val !== "　").length > 5
  ) {
    show("error", "タグの数を５つ以下にしてください。");
    return false;
  }
  //使える形に変換する
  const postingArticle: oneArticleType = {
    ...postValue,
    tags: postValue.tags
      .split(/( |　)/)
      .map((val) => val.replaceAll(/(#|＃)/gi, ""))
      .filter((val) => val !== "" && val !== " " && val !== "　"),
    id: createUUID(),
    createdAt: new Date().getTime(),
    type: "article",
    description: postValue.body.substring(0, 50),
    user: auth.id,
  };
  //投稿する
  await setDoc(doc(db, "world", postingArticle.id), postingArticle);
  //投稿後
  await show("info", "投稿が完了しました。");
  return true;
}
