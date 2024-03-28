import { Dispatch, SetStateAction } from "react";
import styles from "@/styles/components/community/realtime.module.css";

export default function Channel({
  frequency,
  setFrequency,
  min,
  max,
}: {
  frequency: number;
  setFrequency: Dispatch<SetStateAction<number>>;
  min: number;
  max: number;
}) {
  return (
    <div id={styles.channel}>
      <button
        onClick={() => {
          if (frequency !== min) setFrequency(frequency - 1);
        }}
      >
        {"<"}
      </button>
      <input
        type="number"
        value={frequency}
        onChange={(e) => {
          const number = Number(e.target.value);
          if (min <= number && number <= max) setFrequency(number);
        }}
      />
      <button
        onClick={() => {
          if (frequency !== max) setFrequency(frequency + 1);
        }}
      >
        {">"}
      </button>
    </div>
  );
}
