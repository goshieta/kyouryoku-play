import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/components/community/chatroom.module.css";

//チャットのために実装。上方向に無限スクロール。仮想スクロールも取り入れる。
export default function InfiniteScroll({
  data,
  moreLoad,
  isCanReadMore,
}: {
  data: ReactElement[];
  moreLoad: () => void;
  isCanReadMore: boolean;
}) {
  const [isTop, setIsTop] = useState<boolean>(true);

  const gotoTop = useCallback(
    (behavior: ScrollBehavior) =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    []
  );

  useEffect(() => {
    const updateIsTop = () => {
      const scrollPostion = window.scrollY;
      if (scrollPostion === 0) setIsTop(true);
      else setIsTop(false);
    };
    window.addEventListener("scroll", updateIsTop);
    return () => window.removeEventListener("scroll", updateIsTop);
  }, []);

  return (
    <div id={styles.infiniteScrollParent}>
      <div id={styles.fixedArea}>
        <button
          id={styles.gotoTop}
          onClick={() => gotoTop("smooth")}
          style={{ display: isTop ? "none" : "block" }}
        >
          <span className="material-symbols-outlined">expand_less</span>
        </button>
      </div>
      <div id={styles.dataParent}>
        {data}
        {isCanReadMore ? (
          <button onClick={moreLoad} id={styles.moreLoad}>
            <span className="material-symbols-outlined">expand_more</span>
            さらに読み込む
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
