import { EditorProps } from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import React from "react";

export enum EditorLanguage {
  html = "html",
  css = "css",
  javascript = "javascript",
}

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  className: string;
  editors: EditorConfig[];
  reset: (language?: EditorLanguage) => void;
}

const Editors: React.FunctionComponent<CustomEditorProps> = ({ className, editors, reset, ...props }) => {
  return (
    <div className={`${className} pb-4 flex flex-row justify-between box-border`}>
      {editors.map((config) => (
        <WrappedEditor onReset={reset} key={config.heading} config={config} {...props} />
      ))}
    </div>
  );
};

export default Editors;
