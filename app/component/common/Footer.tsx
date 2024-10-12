import styles from "@/styles/components/footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div id={styles.footer}>
      <div id={styles.f_linkArea}>
        <Link href="/">トップ</Link>
        <Link href="/additional/about">このサイトについて</Link>
        <Link href="/additional/report">報告・提案</Link>
        <Link href="/additional/aboutkyouryoku">峡緑について</Link>
        <Link href="/additional/update">アップデート情報</Link>
      </div>
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
