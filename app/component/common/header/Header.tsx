"use client";

import Link from "next/link";
import styles from "@/app/style/component/header.module.css";
import { useState } from "react";
import Image from "next/image";
import UserArea from "./userArea";
import KyouRyoukuPlay from "./kyouryokuPlay";

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
      <Link href="/blog" onClick={handleLinkClick}>
        ブログ
      </Link>
      <Link href="/blog?tag=サポート" onClick={handleLinkClick}>
        サポート
      </Link>
      <Link href="/blog?tag=ヘルプ" onClick={handleLinkClick}>
        ヘルプ
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
        <KyouRyoukuPlay />
        <div id={styles.right}>
          <div id={styles.linkArea}>{links}</div>
          <UserArea />
        </div>
      </div>
    </>
  );
}
