import { Metadata } from "next";
import Link from "next/link";
import styles from "../additional.module.css";

export const metadata: Metadata = {
  title: "報告・提案 - 峡緑プレイ",
};

export default function Report() {
  return (
    <div id={styles.explain_area}>
      <h1>報告・提案</h1>
      <p>
        このサイトに対して報告や提案をしたい方は、以下のURLから報告・提案をしてください。
      </p>
      <p>ここで言う報告・提案とは以下の内容などのことです。</p>
      <ul>
        <li>ゲームのバグの報告</li>
        <li>サイト自体のバグの報告</li>
        <li>追加してほしいゲームの希望</li>
        <li>サイトの機能改善の要望</li>
      </ul>
      <h2 style={{ textAlign: "center" }}>
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLSdaZz9zai6JSEa1zi9yqTfc2A0XtjS8WjYUwYGwWS1lM_0lwA/viewform?usp=sf_link"
          target="_blank"
          rel="norefferrer"
        >
          報告・提案 - 峡緑プレイ
        </Link>
      </h2>
    </div>
  );
}
