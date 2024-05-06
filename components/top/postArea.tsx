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
import styles from "@/styles/page.module.css";

export default function PostArea() {
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
