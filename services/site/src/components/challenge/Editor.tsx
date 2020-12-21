import { ControlledEditorProps } from "@monaco-editor/react";
import WrappedEditor from "app/components/challenge/editor/WrappedEditor";
import TabBar from "app/components/TabBar";
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
