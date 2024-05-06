import styles from "@/styles/components/tips/loading.module.css";

export default function Loading({ type }: { type?: "small" | "big" }) {
  if (!type) type = "big";

  const big = (
    <div id={styles.loadingGame}>
      <div id={styles.loadingFlex}>
        <div className={styles.roundLoader}></div>
        <div className={styles.roundLoader}></div>
        <div className={styles.roundLoader}></div>
      </div>
      <p>読み込み中...</p>
    </div>
  );
  const small = <div id={styles.roundLoading}></div>;

  switch (type) {
    case "big":
      return big;
    case "small":
      return small;
  }
}
