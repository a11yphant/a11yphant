import { EditorProps } from "@monaco-editor/react";
import WrappedEditor from "app/components/challenge/editor/WrappedEditor";
import React from "react";

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  editors: EditorConfig[];
}

interface EditorConfig {
  language: string;
  code: string;
  updateCode: React.Dispatch<React.SetStateAction<string>>;
}

const EditorWrapper: React.FunctionComponent<CustomEditorProps> = ({ editors, ...props }) => {
  return (
    <div>
      {editors.map((config) => (
        <WrappedEditor
          {...props}
          language={config.language}
          value={config.code}
          onChange={(value) => {
            config.updateCode(value);
          }}
        />
      ))}
    </div>
  );
};

export default EditorWrapper;
