import Editor, { EditorProps } from "@monaco-editor/react";
import React, { useCallback, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  config: EditorConfig;
}

export interface EditorConfig {
  language: string;
  code: string;
  updateCode: React.Dispatch<React.SetStateAction<string>>;
  heading: string;
}

// It is necessary to wrap the Editor because the Editor ist exported from @monaco-editor/react
// in memoized form. Meaning you cannot spawn multiple instances when importing it directly.
const WrappedEditor: React.FunctionComponent<CustomEditorProps> = ({ config, ...props }) => {
  // refs to html elements
  const wrapperRef = useRef<HTMLDivElement>();
  const headingRef = useRef<HTMLHeadingElement>();
  const buttonRef = useRef<HTMLButtonElement>();

  // state
  const [editorWidth, setEditorWidth] = useState<number>(0);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  const [editorTop, setEditorTop] = useState<number>(0);

  const updateEditorSize = useCallback(() => {
    if (wrapperRef.current && headingRef.current && buttonRef.current) {
      const wrapperHeight = wrapperRef.current.offsetHeight;
      const headingHeight = headingRef.current.offsetHeight;
      const buttonHeight = buttonRef.current.offsetHeight;
      const wrapperWidth = wrapperRef.current.clientWidth;

      const marginHeading = getComputedStyle(headingRef.current);
      const marginButton = getComputedStyle(buttonRef.current);
      const paddingWrapper = getComputedStyle(wrapperRef.current);

      // calculate real width
      setEditorWidth(wrapperWidth - parseInt(paddingWrapper.paddingLeft) - parseInt(paddingWrapper.paddingRight));
      // calculate real height
      setEditorHeight(
        wrapperHeight -
          parseInt(paddingWrapper.paddingTop) -
          parseInt(paddingWrapper.paddingBottom) -
          headingHeight -
          parseInt(marginHeading.marginTop) -
          parseInt(marginHeading.marginBottom) -
          buttonHeight -
          parseInt(marginButton.marginTop) -
          parseInt(marginButton.marginBottom),
      );

      setEditorTop(parseInt(paddingWrapper.paddingTop) + headingHeight + parseInt(marginHeading.marginTop) + parseInt(marginHeading.marginBottom));
    }
  }, [wrapperRef.current, headingRef.current, buttonRef.current]);

  // hook if dependency changed
  React.useEffect(() => {
    updateEditorSize();
  }, [wrapperRef.current, headingRef.current, buttonRef.current]);

  useResizeDetector({
    targetRef: wrapperRef,
    onResize: updateEditorSize,
  });

  return (
    <div className="editor-container w-inherit h-full box-border">
      <div ref={wrapperRef} className="relative border-2 rounded-lg border-primary py-2 px-4 w-inherit h-full">
        <h3 ref={headingRef} className="text-primary mb-4">
          {config.heading}
        </h3>
        <div className="absolute" style={{ top: editorTop }}>
          <Editor
            {...props}
            language={config.language}
            value={config.code}
            onChange={(value) => {
              config.updateCode(value);
            }}
            width={editorWidth}
            height={editorHeight}
          />
        </div>
        <button className="absolute bottom-2" ref={buttonRef}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default WrappedEditor;
