import { BaseEditor } from "slate";
import { CustomEditor } from "./customEditor";
import { ReactEditor } from "slate-react";

export default function EditorOperation({
  editor,
}: {
  editor: BaseEditor & ReactEditor;
}) {
  return (
    <div>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          CustomEditor.toggleBoldBlock(editor);
        }}
      >
        太字
      </button>
    </div>
  );
}
