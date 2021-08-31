import { EditorProps } from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import React from "react";

export enum EditorLanguage {
  html = "html",
  css = "css",
  javascript = "javascript",
}

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  className?: string;
  editors: EditorConfig[];
  onReset: (language?: EditorLanguage) => void;
}

const Editors: React.FunctionComponent<CustomEditorProps> = ({ className, editors, onReset, ...props }) => {
  return (
    <div className={`${className} flex flex-row justify-between box-border pb-4`}>
      {editors.map((config) => (
        <WrappedEditor onReset={onReset} key={config.heading} config={config} {...props} />
      ))}
    </div>
  );
};

export default Editors;
