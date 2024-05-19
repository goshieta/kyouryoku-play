import { CurrentTagContext } from "@/components/layouts/worldLayout";
import styles from "@/styles/world/world.module.css";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import SuggestTag from "../common/suggestTag";

export default function Query() {
  const currentTag = useContext(CurrentTagContext);
  const [currentInputTag, setCurrentInputTag] = useState<string>(
    !currentTag?.currentTag || currentTag.currentTag === "すべて"
      ? ""
      : currentTag.currentTag
  );
  const router = useRouter();

  const handleSearch = (value?: string) => {
    if (!value) value = currentInputTag;
    if (router.route === "/world") {
      currentTag?.setCurrentTag(value);
    } else {
      router.push(`/world?q=${value}`);
    }
  };

  return (
    <div id={styles.tags}>
      <div id={styles.search}>
        <div id={styles.serachInput}>
          <input
            type="text"
            placeholder="タグ名を入力"
            value={currentInputTag}
            onChange={(e) => setCurrentInputTag(e.target.value)}
            onKeyDown={(e) => {
              if (!e.nativeEvent.isComposing && e.key === "Enter")
                handleSearch();
            }}
          />
          <SuggestTag
            strQuery={currentInputTag}
            setQuery={(newq) => {
              setCurrentInputTag(newq);
              handleSearch(newq);
            }}
          />
        </div>
        <button onClick={() => handleSearch()}>
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </div>
  );
}
