import { KeyboardEvent, useCallback, useState } from "react";
import {
  withReact,
  Slate,
  Editable,
  RenderLeafProps,
  ReactEditor,
  RenderElementProps,
} from "slate-react";
import { createEditor, BaseEditor } from "slate";
import Leaf from "./leaf";
import { CustomEditor } from "./customEditor";
import EditorOperation from "./editorOperation";
import DefaultBlockType, { TitleElement } from "./renderElement";
import styles from "@/styles/world/new/editor.module.css";

export type CustomElementAllType = "paragraph" | "h1" | "h2" | "h3";
export const isCustomElementAllType = (
  arg: any
): arg is CustomElementAllType => {
  return arg === "paragraph" || arg === "h1" || arg === "h2" || arg === "h3";
};
type CustomElement = {
  type: CustomElementAllType;
  children: CustomText[];
};
type CustomText = {
  text: string;
  bold?: true;
  underline?: true;
  link?: string;
};

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
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "h1":
      case "h2":
      case "h3":
        return <TitleElement {...props} />;
      default:
        return <DefaultBlockType {...props} />;
    }
  }, []);

  return (
    <div id={styles.editorArea}>
      <Slate editor={editor} initialValue={initialValue}>
        <EditorOperation editor={editor} />
        <Editable
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={onEditorKeyDown}
        />
      </Slate>
    </div>
  );
}
