import { CurrentTagContext } from "@/components/layouts/worldLayout";
import styles from "@/styles/world/world.module.css";
import { useContext, useState } from "react";

export default function Query() {
  const currentTag = useContext(CurrentTagContext);
  const [currentInputTag, setCurrentInputTag] = useState<string>(
    !currentTag?.currentTag || currentTag.currentTag === "すべて"
      ? ""
      : currentTag.currentTag
  );

  const handleSearch = () => {
    currentTag?.setCurrentTag(currentInputTag);
  };

  return (
    <div id={styles.tags}>
      <div id={styles.search}>
        <input
          type="text"
          placeholder="タグ名を入力"
          value={currentInputTag}
          onChange={(e) => setCurrentInputTag(e.target.value)}
        />
        <button onClick={handleSearch}>
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </div>
  );
}
