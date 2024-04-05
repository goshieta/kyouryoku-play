import styles from "@/styles/world/world.module.css";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Query({
  currentTag,
  setCurrentTag,
  router,
}: {
  currentTag: string | null;
  setCurrentTag: (nct: string | null) => void;
  router: NextRouter;
}) {
  const [tags, setTags] = useState<null | string[]>(null);

  useEffect(() => {
    setTags([
      "すべて",
      "北海道・東北",
      "関東",
      "中部",
      "近畿",
      "広島",
      "中国・四国",
      "九州",
    ]);
  }, [router]);

  return (
    <div id={styles.tags}>
      <div id={styles.search}>
        <input type="text" placeholder="タグ名を入力" />
        <button>
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
      <div id={styles.localTagsWrapper}>
        <div id={styles.localTags}>
          {tags?.map((oneTag) => {
            return (
              <div key={oneTag}>
                <input
                  type="radio"
                  value={oneTag}
                  checked={oneTag === currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  id={`input_radio_for_tag_${oneTag}`}
                />
                <label htmlFor={`input_radio_for_tag_${oneTag}`}>
                  {oneTag}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
