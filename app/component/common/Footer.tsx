import styles from "@/app/style/component/footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div id={styles.footer}>
      <div id={styles.f_linkArea}>
        <Link href="/">トップ</Link>
        <Link href="/blog/15542357-ea21-8033-91ab-cd1580261a28">
          このサイトについて
        </Link>
        <Link href="/blog/15542357-ea21-80c6-82d3-f44c97d82376">ご意見</Link>
        <Link href="/blog/15542357-ea21-80e0-9e4e-f332ba4171a6">
          峡緑について
        </Link>
        <Link href="/blog/15542357-ea21-805a-9bf8-c4e0662cc087">
          プライバシーポリシー
        </Link>
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
