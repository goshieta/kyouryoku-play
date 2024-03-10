import styles from "@/styles/game.module.css";

export default function Loading() {
  return (
    <div id={styles.loadingGame}>
      <div id={styles.loadingFlex}>
        <div className={styles.roundLoader}></div>
        <div className={styles.roundLoader}></div>
        <div className={styles.roundLoader}></div>
      </div>
      <p>読み込み中...</p>
    </div>
  );
}
