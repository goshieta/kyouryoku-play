import { RenderLeafProps, useFocused, useSelected } from "slate-react";
import styles from "@/styles/world/new/editor.module.css";
import { useEffect, useRef, useState } from "react";

const normalStyle = (props: RenderLeafProps) => {
  return {
    fontWeight: props.leaf.bold ? "bold" : "normal",
    textDecoration: props.leaf.underline ? "underline" : "none",
  };
};

export default function Leaf(props: RenderLeafProps) {
  return (
    <span {...props.attributes} style={normalStyle(props)}>
      {props.children}
    </span>
  );
}
export function LinkLeaf(props: RenderLeafProps) {
  const [focused, setFocused] = useState(false);
  const element = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    console.log(element.current);
    const handleFocus = () => {
      setFocused(true);
    };
    const handleBlur = () => {
      setFocused(false);
    };

    if (element.current) {
      element.current?.addEventListener("mouseover", handleFocus);
      element.current?.addEventListener("mouseout", handleBlur);
    }
    return () => {
      element.current?.removeEventListener("mouseover", handleFocus);
      element.current?.removeEventListener("mouseout", handleBlur);
    };
  }, [element]);

  if (props.leaf.link && props.leaf.linkTarget) {
    return (
      <span className={styles.linkParent} ref={element}>
        <a
          {...props.attributes}
          href={props.leaf.linkTarget}
          style={normalStyle(props)}
        >
          {props.children}
        </a>
        {focused && <LinkPopup href={props.leaf.linkTarget} />}
      </span>
    );
  } else {
    return <Leaf {...props} />;
  }
}

function LinkPopup({ href }: { href: string }) {
  return (
    <a
      href={href}
      rel="noreferrer"
      target="_blank"
      contentEditable={false}
      className={styles.linkPopup}
    >
      {href}
    </a>
  );
}
