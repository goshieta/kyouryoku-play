import { BaseEditor, Editor } from "slate";
import { ReactEditor } from "slate-react";

export const CustomEditor = {
  isBoldMarkActive(editor: BaseEditor & ReactEditor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  toggleBoldBlock(editor: BaseEditor & ReactEditor) {
    const isActive = this.isBoldMarkActive(editor);
    if (isActive) Editor.removeMark(editor, "bold");
    else Editor.addMark(editor, "bold", true);
  },
};
