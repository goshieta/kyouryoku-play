import { useCallback, useState } from "react";
import {
  withReact,
  Slate,
  Editable,
  RenderLeafProps,
  ReactEditor,
} from "slate-react";
import { Editor, createEditor, BaseEditor } from "slate";
import Leaf from "./leaf";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string; bold?: true };

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export default function ArticleEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props}></Leaf>,
    []
  );

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          if (!e.ctrlKey) return;

          e.preventDefault();
          switch (e.key) {
            case "b":
              Editor.addMark(editor, "bold", true);
              break;
          }
        }}
      />
    </Slate>
  );
}
