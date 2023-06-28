import styles from "@/styles/components/footer.module.css"

export default function Footer(){
  return (
    <div id={styles.footer}>
      <div id={styles.f_linkArea}>
          <div id={styles.fl_thisSite}>
              <a href="/">トップ</a>
              <a href="/game">ゲーム一覧</a>
              <a href="/recommend">おすすめ</a>
              <a href="/classic">古典的なゲーム</a>
              <a href="/new">独自ゲーム</a>
          </div>
          <div id={styles.fl_otherService}>
              <a href="">ポータル</a>
              <a href="">ゲーム</a>
              <a href="">プライバシーポリシー</a>
              <a href="">報告・提案</a>
              <a href="">このサイトについて</a>
          </div>
        </div>
        <div id={styles.f_logoArea}>
            <div id={styles.fl_logo}>
                <div id={styles.fll_icon}>
                    <img src="/KyouRyoku.png" alt=""/>
                </div>
                <div id={styles.fll_string}>
                    <p>KyouRyoku</p>
                    <h2>峡緑</h2>
                </div>
            </div>
            <p>©2023 峡緑</p>
        </div>
    </div>
  )
}