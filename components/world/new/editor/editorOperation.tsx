import { BaseEditor } from "slate";
import { CustomEditor } from "./customEditor";
import { ReactEditor } from "slate-react";
import styles from "@/styles/world/new/editor.module.css";

export default function EditorOperation({
  editor,
}: {
  editor: BaseEditor & ReactEditor;
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
      </div>
      <div id={styles.selectTextType}>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(editor, "paragraph");
          }}
        >
          <p>通常テキスト</p>
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(editor, "h2");
          }}
        >
          <h2>見出し1</h2>
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(editor, "h3");
          }}
        >
          <h3>見出し2</h3>
        </button>
      </div>
      <div id={styles.saveButtonArea}>
        <button id={styles.saveButton}>保存</button>
        <button id={styles.publishButton}>公開</button>
      </div>
    </div>
  );
}
