import { Metadata } from "next";
import styles from "../additional.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "峡緑について - 峡緑プレイ",
};

export default function Aboutkyouryoku() {
  return (
    <div id={styles.explain_area}>
      <h1>峡緑について</h1>
      <p>
        峡緑（KyouRyoku）はウェブサービスを中心に展開する個人開発のブランドです。
      </p>
      <p>峡緑の理念は以下のとおりとなっています。</p>
      <div className={styles.block}>幸せな ”つながり” を実現する</div>
      <p>
        峡緑はこの理念のもとに、様々な形のサービスで人と人のつながりを良い形で増幅させることをミッションとします。
      </p>
      <p>以下はこのブランドのもとで現在公開されているサービスの一覧です。</p>
      <ul>
        <li>
          <Link
            href="https://kyouryoku-play.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            峡緑プレイ | KyouRyoku Play
          </Link>
        </li>
      </ul>
    </div>
  );
}
