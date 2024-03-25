import React, { MouseEvent, useCallback, useMemo, useState } from "react";
import Message from "./message";

export type messageType = "info" | "alert" | "error";

export default function useMessage() {
  const [messageType, setMessageType] = useState<messageType | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [button, setButton] = useState<string[] | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);

  const [onButtonClicked, setOnButtonClicked] = useState<
    ((e: any) => void) | undefined
  >(undefined);

  const show = useCallback(
    async (messageType: messageType, message: string, button?: string[]) => {
      if (visible) return "error";
      setMessageType(messageType);
      setMessage(message);
      setButton(button ? button : ["閉じる"]);
      setVisible(true);
      return new Promise<string>((resolve) => {
        const buttonClicked = (e: any) => {
          if (e && e.target && typeof e.target.innerHTML === "string") {
            setMessageType(undefined);
            setMessage(undefined);
            setButton(undefined);
            setVisible(false);
            resolve(e.target.innerHTML);
          }
        };
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

  const result: [
    (
      messageType: messageType,
      message: string,
      button?: string[]
    ) => Promise<string>,
    React.FC
  ] = [show, MessageDialog];

  return result;
}
