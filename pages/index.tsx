import Head from "next/head";
import styles from "../styles/page.module.css";
import GameTile from "@/components/GameTile";
import { useEffect, useState } from "react";
import {
  isOneArticleType,
  oneArticleType,
  pubUserDataType,
} from "@/lib/types/communityType";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import OneArticle from "@/components/world/top/oneArticle";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>峡緑プレイ | KyouRyoku Play</title>
        <meta
          name="description"
          content="使いやすく、シンプル、現実世界を重視した新世代のゲームサイト「峡緑プレイ」へようこそ。このサイトでは軽いボードゲームを中心に、様々なゲームを楽しめます。"
        />
      </Head>
      <div id={styles.contentArea}>
        <div id={styles.gameArea}>
          <h2>ゲーム</h2>
          <div className={styles.flexContent}>
            <GameTile gameCode="soccer"></GameTile>
            <GameTile gameCode="westeastbuttle"></GameTile>
            <GameTile gameCode="castlerun"></GameTile>
            <GameTile gameCode="numguess"></GameTile>
            <GameTile gameCode="flyfly"></GameTile>
            <GameTile gameCode="flash"></GameTile>
            <GameTile gameCode="othello"></GameTile>
          </div>
        </div>
        <PostArea />
      </div>
    </>
  );
}

function PostArea() {
  const [posts, setPosts] = useState<oneArticleType[]>([]);
  useEffect(() => {
    getDocs(
      query(collection(db, "world"), orderBy("createdAt", "desc"), limit(10))
    ).then((data) => {
      const newPosts: oneArticleType[] = [];
      data.forEach((oneData) => {
        const structData = oneData.data();
        if (isOneArticleType(structData)) newPosts.push(structData);
      });
      setPosts(newPosts);
    });
  }, []);
  const [users, setUsers] = useState<{ [key: string]: pubUserDataType }>({});

  return (
    <div id={styles.postArea}>
      <h2>最新の投稿</h2>
      <div className={styles.flexContent}>
        {posts.map((onePost) => (
          <OneArticle
            article={onePost}
            usersInfo={users}
            setUsersInfo={setUsers}
            isNoQuote={true}
          />
        ))}
      </div>
      <Link href={"/world"} id={styles.moreRead}>
        もっと見る
      </Link>
    </div>
  );
}
