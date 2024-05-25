import styles from "@/styles/world/new/common.module.css";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import SuggestTag from "../common/suggestTag";
import { showFunctionType } from "@/components/tips/useMessage";

export default function TagInput({
  tags,
  setTags,
  show,
}: {
  tags: string[];
  setTags: (newVal: string[]) => void;
  show: showFunctionType;
}) {
  const [currentInputTag, setCurrentInputTag] = useState("");
  const tagInput = useRef<HTMLInputElement>(null);
  const tagSuggestArea = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setCurrentInputTag(val);

      //スペースを含んでいるかで処理を変える
      if (
        (val.slice(-1) === " " || val.slice(-1) === "　") &&
        val.trim() !== ""
      ) {
        //スペースを含んでいる
        submitTag(val);
      } else {
        setCurrentInputTag(val.trim());
      }
    },
    [currentInputTag, tags]
  );
  const submitTag = useCallback(
    async (val: string) => {
      console.log(val);
      //タグを登録する前にそのタグについて✅する
      if (val.trim().length > 10) {
        await show("error", "長いタグはよくない。せめて10文字以下にして。");
        return;
      }
      if (tags.length > 4) {
        await show("error", "一度につけられるタグの数は5個までです。");
        return;
      }
      setTags([...tags, val.trim()]);
      setCurrentInputTag("");
      tagInput.current?.focus();
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

  const isClickedSuggestion = useRef(false);
  useEffect(() => {
    tagSuggestArea.current?.addEventListener(
      "mousedown",
      () => (isClickedSuggestion.current = true)
    );
    tagSuggestArea.current?.addEventListener(
      "mouseup",
      () => (isClickedSuggestion.current = false)
    );
    tagInput.current?.addEventListener("blur", () => {
      setTimeout(() => {
        if (!isClickedSuggestion.current) setCurrentInputTag("");
      }, 100);
    });
  }, [tagSuggestArea, tagInput]);

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
      <div ref={tagSuggestArea}>
        <SuggestTag
          strQuery={currentInputTag}
          setQuery={submitTag}
          includeCurrent={true}
        />
      </div>
    </div>
  );
}
