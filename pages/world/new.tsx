import { useAuth } from "@/components/context/auth";
import useMessage, { showFunctionType } from "@/components/tips/useMessage";
import OneArticle from "@/components/world/top/oneArticle";
import { db } from "@/lib/firebase/client";
import {
  isOneArticleType,
  oneArticleType,
  userType,
} from "@/lib/types/communityType";
import createUUID from "@/lib/uuid";
import styles from "@/styles/world/new.module.css";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [articleType, setArticleType] = useState<{
    type: "article" | "reply";
    target?: string;
    article?: oneArticleType;
  }>({
    type: "article",
  });

  useEffect(() => {
    if (
      router.query.type &&
      router.query.type === "reply" &&
      typeof router.query.target === "string"
    ) {
      setArticleType({ type: "reply", target: router.query.target });
      //記事の情報を取得する。
      getDoc(doc(db, "world", router.query.target))
        .then((data) => data.data())
        .then((data) => {
          if (
            isOneArticleType(data) &&
            typeof router.query.target === "string"
          ) {
            setArticleType({
              type: "reply",
              target: router.query.target,
              article: data,
            });
          } else {
            setArticleType({
              type: "article",
            });
          }
        });
    }
  }, [router]);

  return (
    <div id={styles.parent}>
      <Message />
      <h1>{articleType.type === "article" ? "投稿" : "返信"}する</h1>
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
          {articleType.article ? (
            <div id={styles.article}>
              <OneArticle
                usersInfo={{}}
                setUsersInfo={() => {}}
                article={articleType.article}
              ></OneArticle>
            </div>
          ) : (
            <></>
          )}
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
              const result = await postArticle(
                inputValue,
                show,
                auth,
                articleType.type,
                articleType.article
              );
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
  auth: userType,
  type: "article" | "reply",
  target?: oneArticleType
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
  const postArticleBase = {
    ...postValue,
    tags: postValue.tags
      .split(/( |　)/)
      .map((val) => val.replaceAll(/(#|＃)/gi, ""))
      .filter((val) => val !== "" && val !== " " && val !== "　"),
    id: createUUID(),
    createdAt: new Date().getTime(),
    type: type,
    description: postValue.body.substring(0, 50),
    user: auth.id,
    like: 0,
    dislike: 0,
    reply: 0,
  };
  const postingArticle: oneArticleType =
    type === "article"
      ? { ...postArticleBase }
      : {
          ...postArticleBase,
          target: target?.id,
          targetUser: target?.user,
          targetTitle: target?.title,
          targetBody: target?.body,
        };
  //投稿する
  await setDoc(doc(db, "world", postingArticle.id), postingArticle);
  if (type === "reply") {
    (async function () {
      const replyCount = (
        await getCountFromServer(
          query(
            collection(db, "world"),
            where("type", "==", "reply"),
            where("target", "==", target?.id)
          )
        )
      ).data().count;
      updateDoc(doc(collection(db, "world"), target?.id), {
        reply: replyCount,
      });
    })();
  }
  //投稿後
  await show("info", "投稿が完了しました。");
  return true;
}
