import { RenderLeafProps } from "slate-react";

export default function Leaf(props: RenderLeafProps) {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
}
