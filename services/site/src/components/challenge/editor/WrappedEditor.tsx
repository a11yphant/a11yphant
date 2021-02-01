import Editor, { EditorProps } from "@monaco-editor/react";
import React from "react";

// It is necessary to wrap the Editor because the Editor ist exported from @monaco-editor/react
// in memoized form. Meaning you cannot spawn multiple instances when importing it directly.
const WrappedEditor: React.FunctionComponent<EditorProps> = (props) => {
  return <Editor {...props} />;
};

export default WrappedEditor;
