import Link from "next/link";
import styles from "../styles/components/header.module.css";

export default function Header() {
  const links = (
    <>
      {" "}
      <Link href="/">トップ</Link>
      <Link href="/additional/about">このサイトについて</Link>
      <Link href="/additional/report">報告・提案</Link>
      <Link href="/additional/aboutkyouryoku">峡緑について</Link>
    </>
  );

  return (
    <>
      <div id={styles.Header}>
        <label id={styles.openMenu} htmlFor={styles.linkAreaNaviInput}>
          <img src="/navigation/menu.svg" alt="メニュー" />
        </label>
        <input type="checkbox" id={styles.linkAreaNaviInput} />
        <a id={styles.titleArea} href="/">
          <div id={styles.titleIconArea}>
            <img src="/icon.png" alt="" width="50" height="50" />
          </div>
          <div id={styles.titleStringArea}>
            <p>KyouRyoku Play</p>
            <h1>峡緑プレイ</h1>
          </div>
        </a>
        <div id={styles.linkArea}>{links}</div>
      </div>
    </>
  );
}
