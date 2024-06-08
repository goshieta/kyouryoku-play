import { BaseEditor } from "slate";
import { CustomEditor } from "./customEditor";
import { ReactEditor } from "slate-react";
import styles from "@/styles/world/new/editor.module.css";
import { CustomElementAllType } from "./articleEditor";

export default function EditorOperation({
  editor,
  focusEditor,
}: {
  editor: BaseEditor & ReactEditor;
  focusEditor: () => void;
}) {
  return (
    <div id={styles.operation}>
      <div id={styles.buttons}>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBoldBlock(editor);
          }}
        >
          <span className="material-symbols-outlined">format_bold</span>
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleUnderlineBlock(editor);
          }}
        >
          <span className="material-symbols-outlined">format_underlined</span>
        </button>
        <button>
          <span className="material-symbols-outlined">link</span>
        </button>
        <button>
          <span className="material-symbols-outlined">imagesmode</span>
        </button>
        <button>
          <span className="material-symbols-outlined">code</span>
        </button>
        <button>
          <span className="material-symbols-outlined">list</span>
        </button>
        <button>
          <span className="material-symbols-outlined">highlight</span>
        </button>
        <button>
          <span className="material-symbols-outlined">error</span>
        </button>
        <select
          id={styles.selectTextType}
          onChange={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(
              editor,
              e.target.value as CustomElementAllType
            );
            focusEditor();
          }}
        >
          <option value="paragraph">通常テキスト</option>
          <option value="h2">見出し1</option>
          <option value="h3">見出し2</option>
        </select>
      </div>
      <div id={styles.saveButtonArea}>
        <button id={styles.saveButton}>保存</button>
        <button id={styles.publishButton}>公開</button>
      </div>
    </div>
  );
}
