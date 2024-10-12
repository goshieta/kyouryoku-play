"use client";

import Link from "next/link";
import styles from "@/app/style/component/header.module.css";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [mobileMenu, setmobileMenu] = useState(false);

  const links = (
    <>
      <Link href="/">トップ</Link>
      <Link href="/additional/about">このサイトについて</Link>
      <Link href="/additional/report">報告・提案</Link>
      <Link href="/additional/aboutkyouryoku">峡緑について</Link>
    </>
  );

  const router = useRouter();

  return (
    <>
      <div id={styles.Header}>
        <button id={styles.openMenu} onClick={() => setmobileMenu(!mobileMenu)}>
          <Image
            src="/navigation/menu.svg"
            alt="メニュー"
            width={30}
            height={30}
          />
        </button>
        <input
          type="checkbox"
          id={styles.linkAreaNaviInput}
          checked={mobileMenu}
          onChange={(event) => setmobileMenu(!mobileMenu)}
        />
        <Link id={styles.titleArea} href="/">
          <div id={styles.titleIconArea}>
            <Image src="/icon.png" alt="" width="50" height="50" />
          </div>
          <div id={styles.titleStringArea}>
            <p>KyouRyoku Play</p>
            <h1>峡緑プレイ</h1>
          </div>
        </Link>
        <div id={styles.linkArea}>{links}</div>
      </div>
    </>
  );
}
