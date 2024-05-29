import { RenderElementProps } from "slate-react";

export default function DefaultBlockType(props: RenderElementProps) {
  return <p {...props.attributes}>{props.children}</p>;
}

export function TitleElement(props: RenderElementProps) {
  switch (props.element.type) {
    case "h1":
      return <h1 {...props.attributes}>{props.children}</h1>;
    case "h2":
      return <h2 {...props.attributes}>{props.children}</h2>;
    case "h3":
      return <h3 {...props.attributes}>{props.children}</h3>;
  }
}
