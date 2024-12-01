import styles from "@/app/style/component/header.module.css";
import Link from "next/link";
import Image from "next/image";

export default function KyouRyoukuPlay() {
  return (
    <Link id={styles.titleArea} href="/">
      <div id={styles.titleIconArea}>
        <Image src="/icon.png" alt="" width="50" height="50" />
      </div>
      <div id={styles.titleStringArea}>
        <p>KyouRyoku Play</p>
        <h1>峡緑プレイ</h1>
      </div>
    </Link>
  );
}
