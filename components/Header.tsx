import styles from "../styles/components/header.module.css"

export default function Header(){
  return (
    <div id={styles.Header}>
      <a id={styles.titleArea} href="/">
        <div id={styles.titleIconArea}>
            <img src="icon.png" alt="" width="50" height="50"/>
        </div>
        <div id={styles.titleStringArea}>
            <p>KyouRyoku Play</p>
            <h1>峡緑プレイ</h1>
        </div>
      </a>
      <div id={styles.linkArea}>
          <a href="/">トップ</a>
          <a href="">ポータル</a>
          <a href="">アバウト</a>
          <a href="">報告・提案</a>
      </div>
    </div>
  )
}