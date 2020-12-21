import { ControlledEditorProps } from "@monaco-editor/react";
import WrappedEditor from "app/components/challenge/editor/WrappedEditor";
import React, { useState } from "react";

enum EditorEnum {
  html = "html",
  css = "css",
  javascript = "javascript",
}

const Editor: React.FunctionComponent<ControlledEditorProps> = (props) => {
  const [activeEditor, setActiveEditor] = useState<EditorEnum>(EditorEnum.html);

  const [htmlEditorValue, setHtmlEditorValue] = useState<string>("<!DOCTYPE html>");
  const [cssEditorValue, setCssEditorValue] = useState<string>("body {background: red}");
  const [jsEditorValue, setJsEditorValue] = useState<string>("console.log('ich bin so cool');");

  return (
    <div>
      <div>
        <button
          onClick={() => {
            setActiveEditor(EditorEnum.html);
          }}
        >
          HTML
        </button>
        <button
          onClick={() => {
            setActiveEditor(EditorEnum.css);
          }}
        >
          CSS
        </button>
        <button
          onClick={() => {
            setActiveEditor(EditorEnum.javascript);
          }}
        >
          JavaScript
        </button>
      </div>

      {activeEditor === EditorEnum.html && (
        <WrappedEditor
          {...props}
          language="html"
          value={htmlEditorValue}
          onChange={(event, value) => {
            setHtmlEditorValue(value);
          }}
        />
      )}
      {activeEditor === EditorEnum.css && (
        <WrappedEditor
          {...props}
          language="css"
          value={cssEditorValue}
          onChange={(event, value) => {
            setCssEditorValue(value);
          }}
        />
      )}
      {activeEditor === EditorEnum.javascript && (
        <WrappedEditor
          {...props}
          language="javascript"
          value={jsEditorValue}
          onChange={(event, value) => {
            setJsEditorValue(value);
          }}
        />
      )}
    </div>
  );
};

export default Editor;
