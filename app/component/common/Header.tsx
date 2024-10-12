import Link from "next/link";
import styles from "../styles/components/header.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

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
  const pageEnter = () => setmobileMenu(false);
  useEffect(() => {
    router.events.on("routeChangeStart", pageEnter);
    return () => router.events.off("routeChangeStart", pageEnter);
  }, []);

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
