import { ReactNode } from "react";
import { HeaderLinks, KyouRyokuPlayCredit } from "../header/Header";
import Query from "@/components/world/top/query";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/world/worldLayout.module.css";

export default function WorldLayout({ children }: { children: ReactNode }) {
  const [currentTag, setCurrentTag] = useState<string | null>("すべて");
  const router = useRouter();
  return (
    <div id="rootParent">
      <div id={styles.headerContainer}>
        <KyouRyokuPlayCredit />
        <Query
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
          router={router}
        />
        <HeaderLinks
          links={[
            { name: "help", href: "/additional/about" },
            { name: "report", href: "/additional/report" },
          ]}
        ></HeaderLinks>
      </div>
      <div id={styles.children}> {children}</div>
    </div>
  );
}
