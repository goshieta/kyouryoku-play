import Link from "next/link";
import styles from "../styles/components/header.module.css";
import Image from "next/image";
import { login } from "@/lib/auth";
import { useAuth } from "./context/auth";

export default function Header() {
  const authInfo = useAuth();
  const userArea = authInfo ? (
    <Link href="/account">
      <Image
        src={authInfo.photoURL}
        alt={authInfo.name}
        width={30}
        height={30}
      ></Image>
    </Link>
  ) : (
    <button onClick={login}>ログイン</button>
  );

  const links = (
    <>
      <Link href="/additional/about" className={styles.headerLink}>
        <span className="material-symbols-outlined">help</span>
      </Link>
      <Link href="/additional/report" className={styles.headerLink}>
        <span className="material-symbols-outlined">report</span>
      </Link>
      {userArea}
    </>
  );

  return (
    <>
      <div id={styles.Header}>
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
