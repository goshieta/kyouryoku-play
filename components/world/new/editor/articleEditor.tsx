import { KeyboardEvent, useCallback, useState } from "react";
import {
  withReact,
  Slate,
  Editable,
  RenderLeafProps,
  ReactEditor,
} from "slate-react";
import { createEditor, BaseEditor } from "slate";
import Leaf from "./leaf";
import { CustomEditor } from "./customEditor";
import EditorOperation from "./editorOperation";

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
  const onEditorKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!e.ctrlKey) return;

      e.preventDefault();
      switch (e.key) {
        case "b":
          CustomEditor.toggleBoldBlock(editor);
      }
    },
    [editor]
  );

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <EditorOperation editor={editor} />
      <Editable renderLeaf={renderLeaf} onKeyDown={onEditorKeyDown} />
    </Slate>
  );
}
