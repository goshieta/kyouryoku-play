import styles from "@/styles/world/new/common.module.css";
import { useState } from "react";
import SuggestTag from "../common/suggestTag";

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (newVal: string[]) => void;
}) {
  const [currentInputTag, setCurrentInputTag] = useState("");

  return (
    <div id={styles.tagInputArea}>
      <input
        type="text"
        placeholder="タグをスペース区切りで入力"
        id={styles.tagInput}
        value={currentInputTag}
        onChange={(e) => setCurrentInputTag(e.target.value)}
      />
      <SuggestTag strQuery={currentInputTag} setQuery={() => {}} />
    </div>
  );
}
