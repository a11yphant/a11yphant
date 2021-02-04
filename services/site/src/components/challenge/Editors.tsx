import { EditorProps } from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import React from "react";

export enum EditorLanguage {
  html = "html",
  css = "css",
  javascript = "javascript",
}

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  classes: string;
  editors: EditorConfig[];
  reset: (language?: EditorLanguage) => void;
}

const Editors: React.FunctionComponent<CustomEditorProps> = ({ classes, editors, reset, ...props }) => {
  return (
    <div className={`${classes} flex flex-row justify-between box-border pb-2`}>
      {editors.map((config) => (
        <WrappedEditor reset={reset} key={config.heading} config={config} {...props} />
      ))}
    </div>
  );
};

export default Editors;
