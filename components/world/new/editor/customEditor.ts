import { BaseEditor, Editor, Element, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { CustomElementAllType } from "./articleEditor";

type editorType = BaseEditor & ReactEditor;

export const CustomEditor = {
  isBoldMarkActive(editor: editorType) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  toggleBoldBlock(editor: editorType) {
    const isActive = this.isBoldMarkActive(editor);
    if (isActive) Editor.removeMark(editor, "bold");
    else Editor.addMark(editor, "bold", true);
  },
  isUnderlineActive(editor: editorType) {
    const marks = Editor.marks(editor);
    return marks ? marks.underline === true : false;
  },
  toggleUnderlineBlock(editor: editorType) {
    const isActive = this.isUnderlineActive(editor);
    if (isActive) Editor.removeMark(editor, "underline");
    else Editor.addMark(editor, "underline", true);
  },

  //ブロックタイプ
  isBlockActive(editor: editorType, name: CustomElementAllType) {
    const match = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === name,
    })
      [Symbol.iterator]()
      .next();

    return !!match.value;
  },
  toggleBlock(editor: editorType, name: CustomElementAllType) {
    const isActive = this.isBlockActive(editor, name);
    Transforms.setNodes(
      editor,
      { type: isActive ? undefined : name },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },
};
