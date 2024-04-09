import Link from "next/link";
import styles from "../../styles/components/header.module.css";
import Image from "next/image";
import { login } from "@/lib/auth";
import { useAuth } from "../context/auth";

export function KyouRyokuPlayCredit({ onlyIcon }: { onlyIcon?: boolean }) {
  return (
    <Link id={styles.titleArea} href="/">
      <div id={styles.titleIconArea}>
        <Image src="/icon.png" alt="" width="50" height="50" />
      </div>
      {!onlyIcon ? (
        <div id={styles.titleStringArea}>
          <p>KyouRyoku Play</p>
          <h1>峡緑プレイ</h1>
        </div>
      ) : (
        <></>
      )}
    </Link>
  );
}

export function UserArea() {
  const authInfo = useAuth();
  return authInfo ? (
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
}

export function HeaderLinks({
  links,
}: {
  links: { name: string; href: string }[];
}) {
  return (
    <div id={styles.linkArea}>
      {links.map((oneLink) => (
        <Link
          href={oneLink.href}
          className={styles.headerLink}
          key={oneLink.name}
        >
          <span className="material-symbols-outlined">{oneLink.name}</span>
        </Link>
      ))}
      <UserArea></UserArea>
    </div>
  );
}

export default function Header() {
  return (
    <>
      <div id={styles.Header}>
        <KyouRyokuPlayCredit />
        <HeaderLinks
          links={[
            { name: "help", href: "/additional/about" },
            { name: "report", href: "/additional/report" },
          ]}
        />
      </div>
    </>
  );
}
