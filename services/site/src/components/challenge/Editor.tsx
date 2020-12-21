import MonacoEditor, { EditorDidMount, EditorProps } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import React, { useRef, useState } from "react";

enum EditorEnum {
  html = "html",
  css = "css",
  javascript = "javascript",
}

const Editor: React.FunctionComponent<EditorProps> = (props) => {
  const valueGetter = useRef<() => string>();
  const editor = useRef<editor.IStandaloneCodeEditor>();

  const [activeEditor, setActiveEditor] = useState<EditorEnum>(EditorEnum.html);

  const [htmlEditorValue, setHtmlEditorValue] = useState<string>("<!DOCTYPE html>");
  const [cssEditorValue, setCssEditorValue] = useState<string>("body {background: red}");
  const [jsEditorValue, setJsEditorValue] = useState<string>("console.log('ich bin so cool');");

  React.useEffect(() => {
    console.log("useEffect", { activeEditor });
    editor.current?.onDidChangeModelContent((e) => {
      console.log(e);
      console.log("changeListener", { activeEditor });
      switch (activeEditor) {
        case EditorEnum.html:
          setHtmlEditorValue(valueGetter.current());
          break;
        case EditorEnum.css:
          setCssEditorValue(valueGetter.current());
          break;
        case EditorEnum.javascript:
          setJsEditorValue(valueGetter.current());
          break;
      }
    });
  }, [activeEditor]);

  const handleEditorDidMount: EditorDidMount = (_valueGetter, _editor) => {
    valueGetter.current = _valueGetter;
    editor.current = _editor;
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

      <MonacoEditor
        {...props}
        language={activeEditor}
        value={activeEditor === EditorEnum.html ? htmlEditorValue : activeEditor === EditorEnum.css ? cssEditorValue : jsEditorValue}
        editorDidMount={handleEditorDidMount}
      />
    </div>
  );
};

export default Editor;
