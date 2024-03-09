import styles from "@/styles/components/community.module.css";
import { ChangeEvent } from "react";

export type Options = "popular" | "active" | "latest" | "oldest";

//コミュニティ検索用のダイアログ
export default function Filter({
  searchString,
  setSearchString,
  searchOption,
  setSearchOption,
}: {
  searchString: string;
  setSearchString: (val: string) => void;
  searchOption: Options;
  setSearchOption: (val: Options) => void;
}) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value === "popular" ||
      e.target.value === "active" ||
      e.target.value === "latest" ||
      e.target.value === "oldest"
    ) {
      setSearchOption(e.target.value);
    }
  };

  return (
    <div id={styles.filterBox}>
      <div id={styles.filterSearchBox}>
        <input
          type="text"
          placeholder="検索"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button>
          <img src="/navigation/search.svg" alt="検索" width={16} height={16} />
        </button>
      </div>
      <div id={styles.filterSearchFromAtt}>
        <div>
          <input
            type="radio"
            name="filterSearchFromAtt"
            id="fsfsfa_popular"
            value="popular"
            checked={searchOption == "popular"}
            onChange={onChange}
          />
          <label htmlFor="fsfsfa_popular">人気</label>
        </div>
        <div>
          <input
            type="radio"
            name="filterSearchFromAtt"
            id="fsfsfa_active"
            value="active"
            checked={searchOption == "active"}
            onChange={onChange}
          />
          <label htmlFor="fsfsfa_active">活発</label>
        </div>
        <div>
          <input
            type="radio"
            name="filterSearchFromAtt"
            id="fsfsfa_latest"
            value="latest"
            checked={searchOption == "latest"}
            onChange={onChange}
          />
          <label htmlFor="fsfsfa_latest">最新</label>
        </div>
        <div>
          <input
            type="radio"
            name="filterSearchFromAtt"
            id="fsfsfa_oldest"
            value="oldest"
            checked={searchOption == "oldest"}
            onChange={onChange}
          />
          <label htmlFor="fsfsfa_oldest">最古</label>
        </div>
      </div>
    </div>
  );
}
