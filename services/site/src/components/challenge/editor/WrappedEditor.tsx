import Editor, { EditorProps } from "@monaco-editor/react";
import Button from "app/components/buttons/Button";
import { EditorLanguage } from "app/components/challenge/Editors";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import Reset from "app/components/icons/Reset";
import ConfirmationModal from "app/components/modal/ConfirmationModal";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

const CTRL_SHIFT_PLATFORMS = ["Macintosh", "MacIntel", "MacPPC", "Mac68K", "iPhone", "iPad", "iPod"];

function getCommandForTabModeSwitch(): "ctrl + shift" | "ctrl" {
  // there is no sign of deprecation of navigator.platform in the spec
  // https://html.spec.whatwg.org/multipage/system-state.html#dom-navigator-platform
  if (typeof navigator === "undefined" || !navigator.platform) {
    return "ctrl";
  }

  if (CTRL_SHIFT_PLATFORMS.includes(navigator.platform)) {
    return "ctrl + shift";
  }

  return "ctrl";
}

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  config: EditorConfig;
  onReset: (language?: EditorLanguage) => void;
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
const WrappedEditor: React.FunctionComponent<CustomEditorProps> = ({ onReset, config, ...props }) => {
  // refs to html elements
  const wrapperRef = useRef<HTMLDivElement>();
  const headingRef = useRef<HTMLHeadingElement>();
  const buttonRef = useRef<HTMLButtonElement>();

  // state
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [editorWidth, setEditorWidth] = useState<number>(0);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  const [editorTop, setEditorTop] = useState<number>(0);

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

  const commandForTabModeSwitch = getCommandForTabModeSwitch();

  return (
    <div className={clsx("w-inherit h-full px-2", "first:pl-0 last:pr-0")}>
      <div ref={wrapperRef} className={clsx("relative", "p-4 w-inherit h-full", "container-dark overflow-hidden")}>
        <div className={clsx("flex flex-row justify-between")}>
          <h3 ref={headingRef} className={clsx("mb-5 mx-3", "h6")}>
            {config.heading}
          </h3>
          <p className="text-grey-middle">
            Press <span className="italic text-grey-middle">{commandForTabModeSwitch} + m</span> to use the tab key for site navigation.
          </p>
        </div>
        <div className={clsx("absolute")} style={{ top: editorTop }}>
          <Editor
            {...props}
            theme="vs-dark"
            language={config.language}
            loading={
              <span>
                <span className={clsx("sr-only")}>The editor is loading...</span>
                <LoadingIndicator className={clsx("w-6 h-6")} />
              </span>
            }
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
          className={clsx(
            "absolute bottom-2 flex items-center text-grey mx-3",
            "group transition duration-300",
            "hover:text-primary-light",
            "focus:text-primary-light",
          )}
          overrideClassName
          innerRef={buttonRef}
        >
          <Reset className={clsx("motion-safe:group-hover:-rotate-260")} />
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
            onReset(config.language);
          }}
        />
      </div>
    </div>
  );
};

export default WrappedEditor;
