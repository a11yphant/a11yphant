import { ControlledEditorProps } from "@monaco-editor/react";
import WrappedEditor from "app/components/challenge/editor/WrappedEditor";
import React from "react";

// enum EditorEnum {
//   html = "html",
//   css = "css",
//   javascript = "javascript",
// }

interface EditorProps extends Omit<ControlledEditorProps, "language" | "value" | "onChange"> {
  htmlCode: string;
  setHtmlCode: React.Dispatch<React.SetStateAction<string>>;
  cssCode: string;
  setCssCode: React.Dispatch<React.SetStateAction<string>>;
  jsCode: string;
  setJsCode: React.Dispatch<React.SetStateAction<string>>;
  activeEditors: ActiveEditors;
}

interface ActiveEditors {
  html: boolean;
  css: boolean;
  js: boolean;
}

const Editor: React.FunctionComponent<EditorProps> = ({ htmlCode, setHtmlCode, cssCode, setCssCode, jsCode, setJsCode, activeEditors, ...props }) => {
  return (
    <div>
      <WrappedEditor
        {...props}
        language="html"
        value={htmlCode}
        onChange={(event, value) => {
          setHtmlCode(value);
        }}
      />
      <WrappedEditor
        {...props}
        language="css"
        value={cssCode}
        onChange={(event, value) => {
          setCssCode(value);
        }}
      />
      <WrappedEditor
        {...props}
        language="javascript"
        value={jsCode}
        onChange={(event, value) => {
          setJsCode(value);
        }}
      />
    </div>
  );
};

export default Editor;
