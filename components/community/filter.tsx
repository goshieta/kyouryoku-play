import styles from "@/styles/components/community/community.module.css";
import { ChangeEvent } from "react";

export type Options = "popular" | "latest" | "oldest" | undefined;

//コミュニティ検索用のダイアログ
export default function Filter({
  searchString,
  setSearchString,
  searchOption,
  setSearchOption,
  onSearchClicked,
}: {
  searchString: string;
  setSearchString: (val: string) => void;
  searchOption: Options;
  setSearchOption: (val: Options) => void;
  onSearchClicked: () => void;
}) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value === "popular" ||
      e.target.value === "latest" ||
      e.target.value === "oldest"
    ) {
      setSearchOption(e.target.value);
      setSearchString("");
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
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearchClicked();
          }}
        />
        <button onClick={onSearchClicked}>
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
