import styles from "@/styles/components/community.module.css";

//コミュニティ検索用のダイアログ
export default function Filter() {
  return (
    <div id={styles.filterBox}>
      <div id={styles.filterSearchBox}>
        <input type="text" placeholder="検索" />
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
            defaultChecked
          />
          <label htmlFor="fsfsfa_popular">人気</label>
        </div>
        <div>
          <input type="radio" name="filterSearchFromAtt" id="fsfsfa_active" />
          <label htmlFor="fsfsfa_active">活発</label>
        </div>
        <div>
          <input type="radio" name="filterSearchFromAtt" id="fsfsfa_latest" />
          <label htmlFor="fsfsfa_latest">最新</label>
        </div>
        <div>
          <input type="radio" name="filterSearchFromAtt" id="fsfsfa_oldest" />
          <label htmlFor="fsfsfa_oldest">最古</label>
        </div>
      </div>
    </div>
  );
}
