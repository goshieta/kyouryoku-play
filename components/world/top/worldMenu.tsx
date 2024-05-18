import styles from "@/styles/world/world.module.css";
import useHasMounted from "@/lib/tips/useHasMounted";
import { useAuth } from "@/components/context/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QueryFieldFilterConstraint, where } from "firebase/firestore";

type oneMenuUiType = {
  name: string;
  iconName: string;
  newCurrentTag: string;
  newQuery: QueryFieldFilterConstraint | undefined;
  tagMatch: string | undefined; //もしメニュー内のどれも選択されていなかったら、これとタグが一致するかで判断する
};

export default function WorldMenu({
  currentTag,
  setCustomQuery,
}: {
  currentTag: {
    currentTag: string | null;
    setCurrentTag: (val: string) => void;
  } | null;
  setCustomQuery: (newQ: QueryFieldFilterConstraint[]) => void;
}) {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const authInfo = useAuth();

  //メニューUIのための変数
  const [trends, setTrends] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | undefined>(undefined);

  //トレンドを取得
  useEffect(() => {
    fetch("/api/getTrend")
      .then((data) => data.text())
      .then((txt) => {
        const trend: string[] = JSON.parse(txt);
        trend.length = 5;
        setTrends(trend);
      });
  }, []);

  //クエリの管理
  const [currentBaseQuery, setCurrentBaseQuery] = useState<
    QueryFieldFilterConstraint | undefined
  >(undefined);
  useEffect(() => {
    if (currentBaseQuery !== undefined) {
      setCustomQuery([currentBaseQuery]);
      currentTag?.setCurrentTag("すべて");
    } else if (
      currentTag &&
      currentTag.currentTag &&
      currentTag.currentTag !== "すべて"
    ) {
      setCustomQuery([where("tags", "array-contains", currentTag.currentTag)]);
      setActiveMenu(currentTag.currentTag);
    } else {
      setCustomQuery([]);
      setActiveMenu("すべて");
    }
  }, [currentTag?.currentTag, currentBaseQuery]);

  //最終メニュークエリを作成
  const rightQuerys: oneMenuUiType[] = [
    //すべて
    {
      name: "すべて",
      iconName: "home",
      newCurrentTag: "すべて",
      newQuery: undefined,
      tagMatch: "すべて",
    },
    //検索結果
    ...(currentTag &&
    currentTag.currentTag &&
    ![...trends, "すべて"].includes(currentTag.currentTag)
      ? [
          {
            name: currentTag.currentTag,
            iconName: "manage_search",
            newCurrentTag: currentTag.currentTag,
            newQuery: undefined,
            tagMatch: currentTag.currentTag,
          },
        ]
      : []),
    //フォロー中
    ...(authInfo
      ? [
          {
            name: "フォロー中",
            iconName: "favorite",
            newCurrentTag: "すべて",
            newQuery: where("user", "in", authInfo.following),
            tagMatch: undefined,
          },
        ]
      : []),
    //トレンド
    ...trends.map((oneTrend) => {
      return {
        name: oneTrend,
        iconName: "trending_up",
        newCurrentTag: oneTrend,
        newQuery: undefined,
        tagMatch: oneTrend,
      };
    }),
  ];

  return (
    <div id={styles.leftItem}>
      {authInfo ? (
        <button
          id={styles.createNew}
          className={styles.leftButton}
          onClick={() => router.push("/world/new")}
        >
          <span className="material-symbols-outlined">article</span>投稿
        </button>
      ) : (
        <></>
      )}
      {hasMounted ? (
        <div id={styles.linkArea}>
          {rightQuerys.map((oneQuery) => (
            <button
              key={oneQuery.name}
              className={oneQuery.name === activeMenu ? styles.tagCurrent : ""}
              onClick={() => {
                setCurrentBaseQuery(oneQuery.newQuery);
                currentTag?.setCurrentTag(oneQuery.newCurrentTag);
                setActiveMenu(oneQuery.name);
              }}
            >
              <span className="material-symbols-outlined">
                {oneQuery.iconName}
              </span>
              {oneQuery.name}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
