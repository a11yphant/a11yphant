import { EditorProps } from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import React from "react";

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  classes: string;
  editors: EditorConfig[];
}

const Editors: React.FunctionComponent<CustomEditorProps> = ({ classes, editors, ...props }) => {
  return (
    <div className={`${classes} flex flex-row justify-between box-border pb-2`}>
      {editors.map((config) => (
        <WrappedEditor key={config.heading} config={config} {...props} />
      ))}
    </div>
  );
};

export default Editors;
