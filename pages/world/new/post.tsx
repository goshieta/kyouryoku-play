import useMessage from "@/components/tips/useMessage";
import SendButton from "@/components/world/new/sendButton";
import TagInput from "@/components/world/new/tagInput";
import styles from "@/styles/world/new/post.module.css";
import { useState } from "react";

export default function NewPost() {
  const [show, Message] = useMessage();
  const [inputValue, setInputValue] = useState<{
    tags: string[];
    body: string;
  }>({ tags: [], body: "" });
  return (
    <div id={styles.post}>
      <Message />
      <h1>つぶやく</h1>
      <TagInput
        tags={inputValue.tags}
        setTags={(newVal) => setInputValue({ ...inputValue, tags: newVal })}
        show={show}
      />
      <div id={styles.textAreaParent}>
        <textarea
          placeholder="内容を入力"
          value={inputValue.body}
          onChange={(e) => {
            if (e.target.value.length > 200) {
              show("error", "200文字までしか入力できません。");
              return;
            }
            setInputValue({ ...inputValue, body: e.target.value });
          }}
          id={styles.bodyInputArea}
        />
        <p id={styles.textAreaCount}>{`${inputValue.body.length}/200文字`}</p>
      </div>
      <SendButton
        type="post"
        show={show}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
}
