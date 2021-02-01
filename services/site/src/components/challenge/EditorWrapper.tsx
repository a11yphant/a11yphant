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
  heading: string;
}

const EditorWrapper: React.FunctionComponent<CustomEditorProps> = ({ editors, ...props }) => {
  return (
    <div className="flex flex-row justify-between h-screen w-full box-border">
      {editors.map((config) => (
        <div key={config.heading} className="editor-container border-2 rounded-lg border-primary py-2 px-4 m-4">
          <h3 className="text-primary mb-4">{config.heading}</h3>
          <WrappedEditor
            {...props}
            language={config.language}
            value={config.code}
            onChange={(value) => {
              config.updateCode(value);
            }}
          />
          <button>Reset</button>
        </div>
      ))}
    </div>
  );
};

export default EditorWrapper;
