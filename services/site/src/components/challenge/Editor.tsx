import { ControlledEditor, ControlledEditorOnChange, ControlledEditorProps } from "@monaco-editor/react";
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

  const handleEditorChange: ControlledEditorOnChange = (event, value) => {
    switch (activeEditor) {
      case EditorEnum.html:
        setHtmlEditorValue(value);
        break;
      case EditorEnum.css:
        setCssEditorValue(value);
        break;
      case EditorEnum.javascript:
        setJsEditorValue(value);
        break;
    }
  };

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

      <ControlledEditor
        {...props}
        language={activeEditor}
        value={activeEditor === EditorEnum.html ? htmlEditorValue : activeEditor === EditorEnum.css ? cssEditorValue : jsEditorValue}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default Editor;
