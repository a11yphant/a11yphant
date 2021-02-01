import { EditorProps } from "@monaco-editor/react";
import WrappedEditor from "app/components/challenge/editor/WrappedEditor";
import TabBar from "app/components/TabBar";
import React, { useState } from "react";

enum EditorEnum {
  html = "html",
  css = "css",
  javascript = "javascript",
}

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  htmlCode: string;
  setHtmlCode: React.Dispatch<React.SetStateAction<string>>;
  cssCode: string;
  setCssCode: React.Dispatch<React.SetStateAction<string>>;
  jsCode: string;
  setJsCode: React.Dispatch<React.SetStateAction<string>>;
}

const Editor: React.FunctionComponent<CustomEditorProps> = ({ htmlCode, setHtmlCode, cssCode, setCssCode, jsCode, setJsCode, ...props }) => {
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
          onChange={(value) => {
            setHtmlCode(value);
          }}
        />
      )}
      {activeEditor === EditorEnum.css && (
        <WrappedEditor
          {...props}
          language="css"
          value={cssCode}
          onChange={(value) => {
            setCssCode(value);
          }}
        />
      )}
      {activeEditor === EditorEnum.javascript && (
        <WrappedEditor
          {...props}
          language="javascript"
          value={jsCode}
          onChange={(value) => {
            setJsCode(value);
          }}
        />
      )}
    </div>
  );
};

export default Editor;
