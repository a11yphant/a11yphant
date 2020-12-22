import { ControlledEditorProps } from "@monaco-editor/react";
import WrappedEditor from "app/components/challenge/editor/WrappedEditor";
import TabBar from "app/components/TabBar";
import React, { useState } from "react";

enum EditorEnum {
  html = "html",
  css = "css",
  javascript = "javascript",
}

interface EditorProps extends Omit<ControlledEditorProps, "language" | "value" | "onChange"> {
  htmlCode: string;
  setHtmlCode: React.Dispatch<React.SetStateAction<string>>;
  cssCode: string;
  setCssCode: React.Dispatch<React.SetStateAction<string>>;
  jsCode: string;
  setJsCode: React.Dispatch<React.SetStateAction<string>>;
}

const Editor: React.FunctionComponent<EditorProps> = ({ htmlCode, setHtmlCode, cssCode, setCssCode, jsCode, setJsCode, ...props }) => {
  const [activeEditor, setActiveEditor] = useState<EditorEnum>(EditorEnum.html);

  return (
    <div>
      <TabBar
        activeId={EditorEnum.html}
        options={[
          {
            id: EditorEnum.html,
            label: "HTML",
            onClick: () => {
              setActiveEditor(EditorEnum.html);
            },
          },
          {
            id: EditorEnum.css,
            label: "CSS",
            onClick: () => {
              setActiveEditor(EditorEnum.css);
            },
          },
          {
            id: EditorEnum.javascript,
            label: "JS",
            onClick: () => {
              setActiveEditor(EditorEnum.javascript);
            },
          },
        ]}
      />

      {activeEditor === EditorEnum.html && (
        <WrappedEditor
          {...props}
          language="html"
          value={htmlCode}
          onChange={(event, value) => {
            setHtmlCode(value);
          }}
        />
      )}
      {activeEditor === EditorEnum.css && (
        <WrappedEditor
          {...props}
          language="css"
          value={cssCode}
          onChange={(event, value) => {
            setCssCode(value);
          }}
        />
      )}
      {activeEditor === EditorEnum.javascript && (
        <WrappedEditor
          {...props}
          language="javascript"
          value={jsCode}
          onChange={(event, value) => {
            setJsCode(value);
          }}
        />
      )}
    </div>
  );
};

export default Editor;
