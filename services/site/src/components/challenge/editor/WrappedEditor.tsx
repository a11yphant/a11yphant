import { ControlledEditor, ControlledEditorProps } from "@monaco-editor/react";
import React from "react";

// It is necessary to wrap the ControlledEditor because the ControlledEditor ist exported from @monaco-editor/react
// in memoized form. Meaning you cannot spawn multiple instances when importing it directly.
const WrappedEditor: React.FunctionComponent<ControlledEditorProps> = (props) => {
  return <ControlledEditor {...props} />;
};

export default WrappedEditor;
