import { Metadata } from "next";
import Link from "next/link";
import styles from "../additional.module.css";

export const metadata: Metadata = {
  title: "ご意見 - 峡緑プレイ",
};

export default function Report() {
  return (
    <div id={styles.explain_area}>
      <h1>ご意見</h1>

      <p>
        バグの報告、機能追加の要望などがありましたら、以下のリンクからお願いします。
      </p>

      <h2>
        <Link
          href="https://forms.gle/UfTfCtC8YDkWXd8D8"
          target="_blank"
          rel="noopener noreferrer"
        >
          報告用フォーム
        </Link>
      </h2>
      <p>バグなどを報告するためのフォームです。</p>
      <h2>
        <Link
          href="https://forms.gle/kqt9KGzQkZbGgQvP7"
          target="_blank"
          rel="noopener noreferrer"
        >
          提案用フォーム
        </Link>
      </h2>
      <p>
        峡緑プレイに追加してほしい機能や、作って欲しいゲームなどを提案するためのフォームです。
      </p>
      <br />
      <br />
      <p>
        またサポートメールもあります。このほかの要件で連絡を取りたい場合は以下のメールアドレスからお願いします。
      </p>
      <a href="mailto:kyouryoku@ymail.ne.jp">kyouryoku@ymail.ne.jp</a>
    </div>
  );
}
