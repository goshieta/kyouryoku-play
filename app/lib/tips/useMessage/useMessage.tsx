import { useCallback, useState } from "react";
import styles from "./styles.module.css";

type optionType = {
  message: string;
  button: { name: string; value: string; icon?: string }[];
};

export default function useMessage() {
  const [Element, setElement] = useState(<></>);

  const message = useCallback(
    (option: optionType) => {
      return new Promise<string>((resolve) => {
        const handleMessageButton = (value: string) => {
          resolve(value);
          setElement(<></>);
        };

        setElement(() => (
          <div id={styles.back_shadow}>
            <div id={styles.box}>
              <p>{option.message}</p>
              <div id={styles.button_area}>
                {option.button.map((buttonInfo) => (
                  <button
                    key={buttonInfo.value}
                    onClick={() => handleMessageButton(buttonInfo.value)}
                  >
                    {buttonInfo.icon ? (
                      <span className="material-symbols-outlined">
                        {buttonInfo.icon}
                      </span>
                    ) : (
                      <></>
                    )}
                    {buttonInfo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ));
      });
    },
    [Element]
  );

  return { message, Element };
}
