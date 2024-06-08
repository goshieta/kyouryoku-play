import { RenderLeafProps, useFocused, useSelected } from "slate-react";
import styles from "@/styles/world/new/editor.module.css";

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
  const focused = useFocused();
  const selected = useSelected();
  if (props.leaf.link && props.leaf.linkTarget) {
    return (
      <span className={styles.linkParent}>
        <a
          {...props.attributes}
          href={props.leaf.linkTarget}
          style={normalStyle(props)}
          onFocus={() => {}}
        >
          {props.children}
        </a>
        {focused && selected && <LinkPopup href={props.leaf.linkTarget} />}
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
