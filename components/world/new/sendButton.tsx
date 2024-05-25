import { useAuth } from "@/components/context/auth";
import { showFunctionType } from "@/components/tips/useMessage";
import sendSome from "@/lib/world/forNew/sendSome";
import styles from "@/styles/world/new/common.module.css";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SendButton({
  show,
  inputValue,
  setInputValue,
}: {
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
    console.log(inputValue);
    if (auth) {
      const result = await sendSome(inputValue, setIsSending);
      if (result === true) {
        //成功
        setInputValue({ title: "", tags: [], body: "" });
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
