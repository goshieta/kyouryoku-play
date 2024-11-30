"use client";

import Link from "next/link";
import styles from "@/app/style/component/header.module.css";
import { useCallback, useState } from "react";
import Image from "next/image";
import UserArea from "./userArea";

export default function Header() {
  const [mobileMenu, setmobileMenu] = useState<boolean | "closing">(false);

  const handleLinkClick = () => {
    if (mobileMenu) {
      setmobileMenu("closing");
      setTimeout(() => {
        setmobileMenu(false);
      }, 400);
    }
  };

  const links = (
    <>
      <Link href="/" onClick={handleLinkClick}>
        トップ
      </Link>
      <Link href="/additional/about" onClick={handleLinkClick}>
        このサイトについて
      </Link>
      <Link href="/additional/report" onClick={handleLinkClick}>
        ご意見
      </Link>
      <Link href="/additional/aboutkyouryoku" onClick={handleLinkClick}>
        峡緑について
      </Link>
    </>
  );

  return (
    <>
      <div
        id={styles.mobile_menu}
        style={{ display: mobileMenu ? "flex" : "none" }}
        className={mobileMenu === "closing" ? styles.closing : ""}
      >
        <button
          id={styles.close_menu}
          onClick={() => {
            setmobileMenu("closing");
            setTimeout(() => {
              setmobileMenu(false);
            }, 400);
          }}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {links}
      </div>
      <div id={styles.Header}>
        <button id={styles.openMenu} onClick={() => setmobileMenu(true)}>
          <Image
            src="/navigation/menu.svg"
            alt="メニュー"
            width={30}
            height={30}
          />
        </button>
        <Link id={styles.titleArea} href="/">
          <div id={styles.titleIconArea}>
            <Image src="/icon.png" alt="" width="50" height="50" />
          </div>
          <div id={styles.titleStringArea}>
            <p>KyouRyoku Play</p>
            <h1>峡緑プレイ</h1>
          </div>
        </Link>
        <div id={styles.right}>
          <div id={styles.linkArea}>{links}</div>
          <UserArea />
        </div>
      </div>
    </>
  );
}
