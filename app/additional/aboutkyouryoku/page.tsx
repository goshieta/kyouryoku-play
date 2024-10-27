import { Metadata } from "next";
import Link from "next/link";
import styles from "../additional.module.css";

export const metadata: Metadata = {
  title: "峡緑について - 峡緑プレイ",
};

export default function Aboutkyouryoku() {
  return (
    <div id={styles.explain_area}>
      <h1>峡緑について</h1>
      <p>峡緑は、私の作成したサイトにつけているブランド名の一つです。</p>
      <p>峡緑ブランドのついたサイトは他にも以下のようなサイトがあります。</p>
      <ul>
        <li>
          <Link href="/">峡緑プレイ（KyouRyoku Play）</Link>
        </li>
        <li>
          <Link href="https://iyqzbugtwfgzyugaybuxxa.on.drv.tw/Indorde%20top/InT.html">
            Inforde Top
          </Link>
        </li>
        <li>
          <Link href="https://iyqzbugtwfgzyugaybuxxa.on.drv.tw/Indorde%20top/InT/Ing/Ing.html">
            Inforde Game
          </Link>
        </li>
        <li>
          <Link href="https://iyqzbugtwfgzyugaybuxxa.on.drv.tw/Indorde%20top/InT/%E7%B0%A1%E5%8D%98!%E8%AA%B0%E3%81%A7%E3%82%82!Javascript%E5%85%A5%E9%96%80/%E5%85%A5%E9%96%80.html">
            簡単！JavaScript入門
          </Link>
        </li>
      </ul>
    </div>
  );
}
