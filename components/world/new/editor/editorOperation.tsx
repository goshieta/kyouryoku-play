import { BaseEditor } from "slate";
import { CustomEditor } from "./customEditor";
import { ReactEditor } from "slate-react";
import { useEffect, useState } from "react";
import { CustomElementAllType, isCustomElementAllType } from "./articleEditor";

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
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          CustomEditor.toggleUnderlineBlock(editor);
        }}
      >
        下線
      </button>
      <button>リンク</button>
      <div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(editor, "paragraph");
          }}
        >
          通常テキスト
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(editor, "h1");
          }}
        >
          見出し
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(editor, "h2");
          }}
        >
          見出し2
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBlock(editor, "h3");
          }}
        >
          見出し3
        </button>
      </div>
    </div>
  );
}
