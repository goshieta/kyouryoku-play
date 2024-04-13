import { ReactNode, createContext, useEffect, useMemo } from "react";
import { HeaderLinks, KyouRyokuPlayCredit } from "../header/Header";
import Query from "@/components/world/top/query";
import styles from "@/styles/world/worldLayout.module.css";
import { useQueryState } from "next-usequerystate";

export const CurrentTagContext = createContext<{
  currentTag: string | null;
  setCurrentTag: (val: string) => void;
} | null>(null);

export default function WorldLayout({ children }: { children: ReactNode }) {
  const [currentTag, setCurrentTag] = useQueryState("q");
  useEffect(() => {
    if (!currentTag) setCurrentTag("すべて");
  }, [currentTag]);
  const contextValue = useMemo(() => {
    return {
      currentTag: currentTag,
      setCurrentTag: setCurrentTag,
    };
  }, [currentTag]);

  return (
    <CurrentTagContext.Provider value={contextValue}>
      <div id="rootParent">
        <div id={styles.headerContainer}>
          <KyouRyokuPlayCredit />
          <Query />
          <HeaderLinks
            links={[
              { name: "help", href: "/additional/about" },
              { name: "report", href: "/additional/report" },
            ]}
          ></HeaderLinks>
        </div>
        <div id={styles.children}> {children}</div>
      </div>
    </CurrentTagContext.Provider>
  );
}
