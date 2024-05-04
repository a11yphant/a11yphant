import { EditorProps } from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import clsx from "clsx";
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
  autoSave: boolean;
}

const Editors: React.FunctionComponent<CustomEditorProps> = ({ className, editors, onReset, autoSave, ...props }) => {
  return (
    <div className={clsx("pb-4 flex flex-col justify-between box-border", "md:flex-row", className)}>
      {editors.map((config) => (
        <WrappedEditor onReset={onReset} key={config.heading} config={config} autoSave={autoSave} {...props} />
      ))}
    </div>
  );
};

export default Editors;
