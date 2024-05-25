import { db } from "@/lib/firebase/client";
import createNGrams from "@/lib/tips/createNgram";
import { isTagType } from "@/lib/types/communityType";
import { collection, getDocs, limit, where, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "@/styles/world/world.module.css";

export default function SuggestTag({
  strQuery,
  setQuery,
  includeCurrent = false,
}: {
  strQuery: string;
  setQuery: (newQuery: string) => void;
  includeCurrent?: boolean;
}) {
  const [suggests, setSuggests] = useState<string[]>([]);
  useEffect(() => {
    if (strQuery.length < 2) {
      setSuggests([]);
      return;
    }
    const ngrams = createNGrams(strQuery, 2);
    const ngramQuery = [];
    for (let onestr in ngrams) {
      ngramQuery.push(where(`forSearch.${onestr}`, "==", true));
    }
    getDocs(query(collection(db, "tags"), limit(5), ...ngramQuery)).then(
      (someData) => {
        const tags: string[] = [];
        someData.forEach((data) => {
          const oneData = data.data();
          if (isTagType(oneData)) {
            tags.push(oneData.name);
          }
        });
        setSuggests(tags);
      }
    );
  }, [strQuery]);

  const targetTagString = Array.from(
    new Set(
      (includeCurrent && strQuery.trim() !== "" ? [strQuery] : []).concat(
        suggests
      )
    )
  );

  return (
    <div id={styles.suggests}>
      {targetTagString.map((suggest) => (
        <p key={suggest} onClick={() => setQuery(suggest)}>
          {suggest}
        </p>
      ))}
    </div>
  );
}
