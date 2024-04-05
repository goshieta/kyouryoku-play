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
    setTags(["すべて"]);
  }, [router]);

  return (
    <div id={styles.tags}>
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
            <label htmlFor={`input_radio_for_tag_${oneTag}`}>{oneTag}</label>
          </div>
        );
      })}
    </div>
  );
}
