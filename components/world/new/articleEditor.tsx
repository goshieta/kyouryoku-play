import React, { useMemo, useState, useCallback } from "react";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import {
  createEditor,
  Editor,
  Transforms,
  Element as SlateElement,
  Range,
} from "slate";
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import { Button, Icon, Toolbar } from "./editorAdditional";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
type CustomElement = { type: string; url?: string; children: Descendant[] };
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
  }
}

const convertDescendantsToCustomElements = (
  descendants: Descendant[]
): CustomElement[] => {
  return descendants.map((descendant) => {
    // ここでCustomElementに変換する処理を実装します
    if ("type" in descendant) {
      // CustomElementの場合はそのまま返す
      return descendant as CustomElement;
    } else {
      // DescendantがBaseTextの場合など、適切な変換処理を実装します
      return {
        type: "paragraph",
        children: [{ text: (descendant as { text: string }).text }],
      };
    }
  });
};

const MyEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<CustomElement[]>(() => {
    // 初期値をDescendant[]型からCustomElement[]型に変換して設定します
    const initialValue: Descendant[] = [
      {
        type: "paragraph",
        children: [{ text: "A line of text in a paragraph." }],
      },
    ];
    return convertDescendantsToCustomElements(initialValue);
  });

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "heading-one":
        return <h1 {...props.attributes}>{props.children}</h1>;
      case "heading-two":
        return <h2 {...props.attributes}>{props.children}</h2>;
      case "heading-three":
        return <h3 {...props.attributes}>{props.children}</h3>;
      case "heading-four":
        return <h4 {...props.attributes}>{props.children}</h4>;
      case "heading-five":
        return <h5 {...props.attributes}>{props.children}</h5>;
      case "heading-six":
        return <h6 {...props.attributes}>{props.children}</h6>;
      case "link":
        return (
          <a {...props.attributes} href={props.element.url}>
            {props.children}
          </a>
        );
      case "image":
        return <img {...props.attributes} src={props.element.url} alt="" />;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return (
      <span
        {...props.attributes}
        style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
      >
        {props.children}
      </span>
    );
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={convertDescendantsToCustomElements(value)}
      onChange={(newValue: Descendant[]) => {
        // Descendant[]型からCustomElement[]型に変換してsetValueに渡します
        setValue(convertDescendantsToCustomElements(newValue));
      }}
    >
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="heading-three" icon="looks_3" />
        <BlockButton format="heading-four" icon="looks_4" />
        <BlockButton format="heading-five" icon="looks_5" />
        <BlockButton format="heading-six" icon="looks_6" />
        <InsertLinkButton />
        <InsertImageButton />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case "b": {
              event.preventDefault();
              toggleMark(editor, "bold");
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as CustomElement).type === format,
    // 上記の条件が真の場合、nはCustomElement型であることが保証されるので、n.typeを安全に参照できます。
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks: Record<string, any> = Editor.marks(editor) || {};
  return marks[String(format)] === true;
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const InsertLinkButton = () => {
  const editor = useSlate();

  const insertLink = (url: string) => {
    if (editor.selection) {
      wrapLink(editor, url);
    }
  };

  return (
    <Button
      active={false}
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the link:");
        if (!url) return;
        insertLink(url);
      }}
    >
      <Icon>link</Icon>
    </Button>
  );
};

const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  if (isCollapsed) {
    Transforms.insertNodes(editor, {
      type: "link",
      url,
      children: [{ text: url }],
    });
  } else {
    Transforms.wrapNodes(
      editor,
      {
        type: "link",
        url,
        children: [],
      },
      { split: true }
    );
    Transforms.collapse(editor, { edge: "end" });
  }
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

const isLinkActive = (editor: Editor) => {
  const [link] = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
    })
  );
  return !!link;
};

const InsertImageButton = () => {
  const editor = useSlate();

  const insertImage = (url: string) => {
    const text = { text: "" };
    const image = { type: "image", url, children: [text] };
    Transforms.insertNodes(editor, image);
  };

  return (
    <Button
      active={false}
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (!url) return;
        insertImage(url);
      }}
    >
      <Icon>image</Icon>
    </Button>
  );
};

export default MyEditor;
