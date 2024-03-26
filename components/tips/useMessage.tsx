import React, { useCallback, useState } from "react";
import Message from "./message";

export type messageType = "info" | "alert" | "error";
export type messageButtonType = {
  name: string;
  value: string;
  type?: "normal" | "cancel";
};

export type showFunctionType = (
  messageType: messageType,
  message: string,
  button?: messageButtonType[]
) => Promise<string>;

export default function useMessage() {
  const [messageType, setMessageType] = useState<messageType | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [button, setButton] = useState<messageButtonType[] | undefined>(
    undefined
  );
  const [visible, setVisible] = useState<boolean>(false);

  const [onButtonClicked, setOnButtonClicked] = useState<
    ((value: string) => void) | undefined
  >(undefined);

  const show: showFunctionType = useCallback(
    async (messageType, message, button) => {
      if (visible) return "error";
      setMessageType(messageType);
      setMessage(message);
      setButton(button ? button : [{ name: "閉じる", value: "close" }]);
      setVisible(true);
      return new Promise((resolve) => {
        const buttonClicked = (value: string) => {
          setMessageType(undefined);
          setMessage(undefined);
          setButton(undefined);
          setVisible(false);
          resolve(value);
        };
        //直接関数を渡すとその関数が評価されてしまうので、ラップして渡す。
        setOnButtonClicked(() => buttonClicked);
      });
    },
    [messageType, message, button, visible, onButtonClicked]
  );

  const MessageDialog: React.FC = useCallback(() => {
    if (!messageType || !message || !button || !visible || !onButtonClicked)
      return <></>;
    return (
      <>
        <Message
          messageType={messageType}
          message={message}
          button={button}
          onButtonClicked={onButtonClicked}
        ></Message>
      </>
    );
  }, [messageType, message, button, visible, onButtonClicked]);

  const result: [showFunctionType, React.FC] = [show, MessageDialog];

  return result;
}
