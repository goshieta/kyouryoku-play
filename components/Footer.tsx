import styles from "@/styles/components/footer.module.css";
import Image from "next/image";

export default function Footer() {
  return (
    <div id={styles.footer}>
      <div id={styles.f_logoArea}>
        <div id={styles.fl_logo}>
          <div id={styles.fll_icon}>
            <Image src="/KyouRyoku.png" alt="" width={50} height={50} />
          </div>
          <div id={styles.fll_string}>
            <p>KyouRyoku</p>
            <h2>峡緑</h2>
          </div>
        </div>
        <p>©2023 峡緑</p>
      </div>
    </div>
  );
}
