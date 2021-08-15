import Editor, { EditorProps } from "@monaco-editor/react";
import Button from "app/components/buttons/Button";
import { EditorLanguage } from "app/components/challenge/Editors";
import Reset from "app/components/icons/Reset";
import ConfirmationModal from "app/components/modal/ConfirmationModal";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { animated, useSpring } from "react-spring";

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  config: EditorConfig;
  reset: (language?: EditorLanguage) => void;
}

export interface EditorConfig {
  languageLabel: string;
  language: EditorLanguage;
  code: string;
  updateCode: React.Dispatch<React.SetStateAction<string>>;
  heading: string;
}

// It is necessary to wrap the Editor because the Editor ist exported from @monaco-editor/react
// in memoized form. Meaning you cannot spawn multiple instances when importing it directly.
const WrappedEditor: React.FunctionComponent<CustomEditorProps> = ({ reset, config, ...props }) => {
  // refs to html elements
  const wrapperRef = useRef<HTMLDivElement>();
  const headingRef = useRef<HTMLHeadingElement>();
  const buttonRef = useRef<HTMLButtonElement>();

  // state
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [editorWidth, setEditorWidth] = useState<number>(0);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  const [editorTop, setEditorTop] = useState<number>(0);

  const [animateIcon, setAnimateIcon] = useState<boolean>(false);

  const updateEditorSize = useCallback(() => {
    if (wrapperRef.current && headingRef.current && buttonRef.current) {
      const wrapperHeight = wrapperRef.current.offsetHeight;
      const headingHeight = headingRef.current.offsetHeight;
      const buttonHeight = buttonRef.current.offsetHeight;
      const wrapperWidth = wrapperRef.current.clientWidth;

      const marginHeading = window.getComputedStyle(headingRef.current);
      const marginButton = window.getComputedStyle(buttonRef.current);
      const paddingWrapper = window.getComputedStyle(wrapperRef.current);

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
  }, [wrapperRef, headingRef, buttonRef]);

  useResizeDetector({
    targetRef: wrapperRef,
    onResize: updateEditorSize,
  });

  const AnimatedResetIcon = animated(Reset);

  // any is necessary here because the types of react-spring are somehow messed up
  const { transform }: any = useSpring({
    transform: animateIcon ? "rotate(100deg)" : "rotate(360deg)",
    config: {
      tension: 0,
      duration: 300,
      delay: 0,
    },
  });

  return (
    <div className={clsx("w-inherit h-full", "editor-container")}>
      <div ref={wrapperRef} className={clsx("p-4 w-inherit h-full", "container-dark overflow-hidden")}>
        <h3 ref={headingRef} className={clsx("mb-5 mx-3", "h6")}>
          {config.heading}
        </h3>
        <div className="absolute" style={{ top: editorTop }}>
          <Editor
            {...props}
            theme="vs-dark"
            language={config.language}
            value={config.code}
            onChange={(value) => {
              config.updateCode(value);
            }}
            width={editorWidth}
            height={editorHeight}
          />
        </div>
        <Button
          onClick={() => {
            setModalOpen(true);
          }}
          onMouseEnter={() => {
            setAnimateIcon((prevRotateIcon) => !prevRotateIcon);
          }}
          onMouseLeave={() => {
            setAnimateIcon((prevRotateIcon) => !prevRotateIcon);
          }}
          className={clsx("absolute bottom-2 flex items-center text-grey mx-3", "group transition duration-300 hover:text-primaryLight")}
          overrideClassName
          innerRef={buttonRef}
        >
          <AnimatedResetIcon style={{ transform: transform }} />
          Reset
        </Button>

        <ConfirmationModal
          open={modalOpen}
          title="Do you really want to reset the code?"
          onCancel={() => {
            setModalOpen(false);
          }}
          confirmButtonLabel={`Reset ${config.languageLabel}`}
          onConfirm={() => {
            setModalOpen(false);
            reset(config.language);
          }}
        />
      </div>
    </div>
  );
};

export default WrappedEditor;
