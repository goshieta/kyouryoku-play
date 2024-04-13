import styles from "@/styles/world/world.module.css";
import { NextRouter } from "next/router";

export default function Query({
  currentTag,
  setCurrentTag,
  router,
}: {
  currentTag: string | null;
  setCurrentTag: (nct: string | null) => void;
  router: NextRouter;
}) {
  return (
    <div id={styles.tags}>
      <div id={styles.search}>
        <input type="text" placeholder="タグ名を入力" />
        <button>
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </div>
  );
}
