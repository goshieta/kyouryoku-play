import { useAuth } from "@/components/context/auth";
import { showFunctionType } from "@/components/tips/useMessage";
import sendSome from "@/lib/world/forNew/sendSome";
import styles from "@/styles/world/new/common.module.css";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SendButton({
  type,
  show,
  inputValue,
  setInputValue,
}: {
  type: "reply" | "article" | "post";
  show: showFunctionType;
  inputValue: { title?: ""; tags: string[]; body: string };
  setInputValue: (newInputValue: {
    title?: "";
    tags: string[];
    body: string;
  }) => void;
}) {
  const [isSending, setIsSending] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    if (auth) {
      const result = await sendSome(type, inputValue, setIsSending, auth.id);
      if (result === true) {
        //成功
        setInputValue({ title: "", tags: [], body: "" });
        await show("info", "投稿が完了しました。");
        router.push("/world");
      } else {
        //エラー発生
      }
    } else show("error", "投稿するにはログインしてください。");
  };

  return (
    <button onClick={handleClick} disabled={isSending} id={styles.sendButton}>
      {isSending ? "投稿中..." : "投稿"}
    </button>
  );
}
