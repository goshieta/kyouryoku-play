import styles from "@/styles/world/new/common.module.css";
import { ChangeEvent, MouseEvent, useCallback, useRef, useState } from "react";
import SuggestTag from "../common/suggestTag";

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (newVal: string[]) => void;
}) {
  const [currentInputTag, setCurrentInputTag] = useState("");
  const tagInput = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      //スペースを含んでいるかで処理を変える
      if (
        (val.slice(-1) === " " || val.slice(-1) === "　") &&
        val.trim() !== ""
      ) {
        //スペースを含んでいる
        setTags([...tags, val.trim()]);
        setCurrentInputTag("");
      } else {
        setCurrentInputTag(val.trim());
      }
    },
    [currentInputTag, tags]
  );
  const handleDeleteTag = useCallback(
    (targetVal: string) => {
      const value = targetVal.trim();
      setTags(tags.filter((oneTag) => oneTag !== value));
    },
    [tags]
  );

  return (
    <div id={styles.tagInputArea}>
      <div id={styles.tagInput}>
        {tags.map((oneTag) => (
          <p className={styles.oneTag} key={oneTag}>
            {oneTag}
            <button onClick={() => handleDeleteTag(oneTag)}>×</button>
          </p>
        ))}
        <input
          type="text"
          placeholder="タグをスペース区切りで入力"
          value={currentInputTag}
          onChange={handleChange}
          id={styles.tagInputInput}
          ref={tagInput}
        />
      </div>
      <SuggestTag
        strQuery={currentInputTag}
        setQuery={(val) => {
          setTags([...tags, val]);
          setCurrentInputTag("");
          tagInput.current?.focus();
        }}
      />
    </div>
  );
}
