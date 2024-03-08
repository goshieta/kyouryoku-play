import Filter from "@/components/community/filter";
import styles from "@/styles/components/community.module.css";

//コミュニティグループの一覧画面
export default function CommunityAll() {
  return (
    <div id={styles.parent}>
      <h1>コミュニティ</h1>
      <div id={styles.left}>
        <Filter></Filter>
      </div>
      <div id={styles.right}></div>
    </div>
  );
}
