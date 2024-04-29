import { db } from "@/lib/firebase/client";
import {
  isOneArticleType,
  oneArticleType,
  pubUserDataType,
} from "@/lib/types/communityType";
import {
  QueryOrderByConstraint,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect, ChangeEvent } from "react";
import OneArticle from "../world/top/oneArticle";
import styles from "@/styles/account/post.module.css";

const isSortType = (val: string): val is "latest" | "popular" | "oldest" =>
  val === "latest" || val === "popular" || val === "oldest";

export default function Post({
  id,
  info,
}: {
  id: string | undefined | null;
  info: pubUserDataType | null | undefined;
}) {
  const [sortType, setSortType] = useState<"latest" | "popular" | "oldest">(
    "latest"
  );
  const radioOnchange = (e: ChangeEvent<HTMLInputElement>) =>
    isSortType(e.target.value) ? setSortType(e.target.value) : {};
  const [posts, setPosts] = useState<oneArticleType[]>([]);
  const [userType, setUserType] = useState<
    { [key: string]: pubUserDataType } | undefined
  >(undefined);

  useEffect(() => {
    if (!id) return;
    let order: QueryOrderByConstraint | null = null;
    switch (sortType) {
      case "latest":
        order = orderBy("createdAt", "desc");
        break;
      case "popular":
        order = orderBy("like", "desc");
        break;
      case "oldest":
        order = orderBy("createdAt", "asc");
        break;
    }
    getDocs(
      query(collection(db, "world"), where("user", "==", id), limit(20), order)
    )
      .then((data) => data.docs.map((oneData) => oneData.data()))
      .then((data) => {
        const posts: oneArticleType[] = [];
        data.forEach((oneData) => {
          if (isOneArticleType(oneData)) posts.push(oneData);
        });
        setPosts(posts);
      });
  }, [id, sortType]);

  useEffect(() => {
    if (info && id) {
      setUserType({ [id]: info });
    }
  }, [info, id]);

  return info ? (
    <div id={styles.postsArea}>
      <div id={styles.caption}>
        <div id={styles.selectArea}>
          <div>
            <input
              type="radio"
              name="select_show_type"
              id="select_show_type_latest"
              value="latest"
              checked={sortType === "latest"}
              onChange={radioOnchange}
            />
            <label htmlFor="select_show_type_latest">最新</label>
          </div>
          <div>
            <input
              type="radio"
              name="select_show_type"
              id="select_show_type_popular"
              value="popular"
              checked={sortType === "popular"}
              onChange={radioOnchange}
            />
            <label htmlFor="select_show_type_popular">人気</label>
          </div>
          <div>
            <input
              type="radio"
              name="select_show_type"
              id="select_show_type_oldest"
              value="oldest"
              checked={sortType === "oldest"}
              onChange={radioOnchange}
            />
            <label htmlFor="select_show_type_oldest">最古</label>
          </div>
        </div>
      </div>
      <div id={styles.posts}>
        {userType ? (
          posts.map((onePost) => (
            <OneArticle
              article={onePost}
              usersInfo={userType}
              setUsersInfo={setUserType}
              key={onePost.id}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
