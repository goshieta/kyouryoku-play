import { useAuth } from "@/components/context/auth";
import { showFunctionType } from "@/components/tips/useMessage";
import sendSome from "@/lib/world/forNew/sendSome";
import styles from "@/styles/world/new/common.module.css";
import { useRouter } from "next/router";
import { useState } from "react";

type commonSBPType = { show: showFunctionType };

type replyInputValueType = {
  tags: string[];
  body: string;
};
type replyValue = {
  type: "reply";
  inputValue: replyInputValueType;
  targetValue: {
    target: string;
    targetUser: string;
    targetTitle: string | null;
    targetBody: string;
  };
  setInputValue: (newInputValue: replyInputValueType) => void;
};

type postInputValueType = {
  tags: string[];
  body: string;
};
type postValue = {
  type: "post";
  inputValue: postInputValueType;
  setInputValue: (newInputValue: postInputValueType) => void;
};

type sendButtonPropsType = commonSBPType & (replyValue | postValue);

export default function SendButton({
  type,
  show,
  inputValue,
  setInputValue,
  ...args
}: sendButtonPropsType) {
  const [isSending, setIsSending] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    if (auth) {
      let sendSomeSendData = inputValue;
      if (type === "reply" && "targetValue" in args)
        sendSomeSendData = { ...inputValue, ...args.targetValue };
      const result = await sendSome(
        type,
        sendSomeSendData,
        setIsSending,
        auth.id
      );

      if (result === true) {
        //成功
        setInputValue({ tags: [], body: "" });
        await show("info", "投稿が完了しました。");
        router.push("/world");
      } else {
        //エラー発生
        for (let oneError of result) {
          await show("error", oneError.body);
        }
      }
    } else show("error", "投稿するにはログインしてください。");
  };

  return (
    <button onClick={handleClick} disabled={isSending} id={styles.sendButton}>
      {isSending ? "投稿中..." : "投稿"}
    </button>
  );
}
