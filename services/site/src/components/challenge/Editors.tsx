import { EditorProps } from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import React from "react";

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  editors: EditorConfig[];
}

const Editors: React.FunctionComponent<CustomEditorProps> = ({ editors, ...props }) => {
  return (
    <div className="flex flex-row justify-between h-screenHalf w-full box-border">
      {editors.map((config) => (
        <WrappedEditor key={config.heading} width="400px" height="400px" config={config} {...props} />
      ))}
    </div>
  );
};

export default Editors;
