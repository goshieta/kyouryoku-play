import OneArticle from "@/components/world/top/oneArticle";
import { db } from "@/lib/firebase/client";
import {
  isOneArticleType,
  oneArticleType,
  pubUserDataType,
} from "@/lib/types/communityType";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useState } from "react";
import styles from "@/styles/world/oneArticle.module.css";
import Head from "next/head";
import WorldLayout from "@/components/layouts/worldLayout";

export default function OneArticlePage() {
  const router = useRouter();
  const [article, setArticle] = useState<oneArticleType | undefined | null>(
    null
  );
  const [reply, setReply] = useState<oneArticleType[]>([]);
  const [usersInfo, setUsersInfo] = useState<{
    [key: string]: pubUserDataType;
  }>({});
  const title = useMemo(() => {
    if (!article) return "存在しない投稿";
    if (article.type === "article") return article.title;
    else {
      let bodyHead: string =
        article.body.substring(0, 10) +
        (article.body.length <= 10 ? "" : "...");
      return bodyHead;
    }
  }, [article]);

  useEffect(() => {
    //記事を読み込み
    (async function () {
      const id = router.query.id;
      if (typeof id !== "string") return;
      const snapShot = await getDoc(doc(collection(db, "world"), id));
      const data = snapShot.data();
      if (isOneArticleType(data)) {
        setArticle(data);
      } else {
        setArticle(undefined);
      }
    })();
    //返信を読み込み
    (async function () {
      const id = router.query.id;
      if (typeof id !== "string") return;
      const snapShot = await getDocs(
        query(
          collection(db, "world"),
          where("type", "==", "reply"),
          where("target", "==", id),
          orderBy("createdAt", "asc"),
          limit(20)
        )
      );
      const replys: oneArticleType[] = [];
      snapShot.forEach((oneReply) => {
        const data = oneReply.data();
        if (isOneArticleType(data)) {
          replys.push(data);
        }
      });
      setReply(replys);
    })();
  }, [router]);

  return (
    <>
      <Head>
        <title>{`${title} - 峡緑プレイ`}</title>
      </Head>
      <div id={styles.oneArticle}>
        <div id={styles.headArea}>
          <div id={styles.operationArea}>
            <button onClick={router.back}>
              <span className="material-symbols-outlined">
                arrow_back_ios_new
              </span>
            </button>
            <button onClick={() => router.push("/world")}>
              <span className="material-symbols-outlined">home</span>
            </button>
          </div>
          <h1>{title}</h1>
        </div>
        <div id={styles.oneArticleArea}>
          {article ? (
            <OneArticle
              article={article}
              usersInfo={usersInfo}
              setUsersInfo={setUsersInfo}
            />
          ) : (
            <h2 id={styles.pageState}>
              {article === undefined
                ? "存在しない投稿です"
                : "読み込み中です..."}
            </h2>
          )}
        </div>
        <h2 id={styles.replyTitle}>返信</h2>
        <div id={styles.replyArea}>
          {reply.map((oneReply) => (
            <OneArticle
              article={oneReply}
              usersInfo={usersInfo}
              setUsersInfo={setUsersInfo}
              key={oneReply.id}
              isNoQuote={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}

OneArticlePage.getLayout = (page: ReactElement) => (
  <WorldLayout>{page}</WorldLayout>
);
