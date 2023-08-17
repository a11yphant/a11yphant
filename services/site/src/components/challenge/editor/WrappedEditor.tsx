import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";
import Button from "app/components/buttons/Button";
import ModeCommandHint from "app/components/challenge/editor/ModeCommandHint";
import { EditorLanguage } from "app/components/challenge/Editors";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import Reset from "app/components/icons/Reset";
import ConfirmationModal from "app/components/modal/ConfirmationModal";
import theme from "app/monaco-theme/a11yphant-color-theme.json";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

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
  // custom editor theme styling
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("a11yphant", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "90ba6f" },
          { token: "comment.js", foreground: "ffa92cd4", fontStyle: "bold" },
          { token: "comment.css", foreground: "ffa67e", fontStyle: "italic" },
          { token: "editor.foreground", foreground: "B4B8B8" },
          { token: "metatag.html", foreground: "B4B8B8" },
          { token: "metatag.content.html", foreground: "f27894" },
          { token: "tag.html", foreground: "B795FF" },
          { token: "delimiter.html", foreground: "B4B8B8" },
          { token: "tag.css", foreground: "B795FF" },
          { token: "attribute.value.html", foreground: "f27894" },
          { token: "attribute.name.html", foreground: "ffffff" },
          { token: "attribute.name.css", foreground: "ffffff" },
          { token: "attribute.value.number.css", foreground: "f27894" },
          { token: "attribute.value.unit.css", foreground: "f27894" },
        ],
        ...theme,
      });
      monaco.editor.setTheme("a11yphant");
    }
  }, [monaco]);

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
      setEditorWidth(wrapperWidth - parseInt(paddingWrapper.paddingLeft || "0") - parseInt(paddingWrapper.paddingRight || "0"));
      // calculate real height
      setEditorHeight(
        wrapperHeight -
          parseInt(paddingWrapper.paddingTop || "0") -
          parseInt(paddingWrapper.paddingBottom || "0") -
          headingHeight -
          parseInt(marginHeading.marginTop || "0") -
          parseInt(marginHeading.marginBottom || "0") -
          buttonHeight -
          parseInt(marginButton.marginTop || "0") -
          parseInt(marginButton.marginBottom || "0"),
      );

      setEditorTop(
        parseInt(paddingWrapper.paddingTop || "0") +
          headingHeight +
          parseInt(marginHeading.marginTop || "0") +
          parseInt(marginHeading.marginBottom || "0"),
      );
    }
  }, [wrapperRef, headingRef, buttonRef]);

  useResizeDetector({
    targetRef: wrapperRef,
    onResize: updateEditorSize,
  });

  return (
    <div className={clsx("w-inherit h-full px-2", "first:pl-0 last:pr-0")}>
      <div ref={wrapperRef} className={clsx("relative", "px-4 py-3 sm:p-4 w-inherit h-full", "container-dark overflow-hidden")}>
        <div className={clsx("flex flex-row justify-between")}>
          <h3 ref={headingRef} className={clsx("mb-5 sm:mx-3", "h6")}>
            {config.heading}
          </h3>
          <ModeCommandHint />
        </div>
        <div className={clsx("absolute -ml-3")} style={{ top: editorTop }}>
          <Editor
            {...props}
            theme="a11yphant"
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
            "absolute bottom-2 flex items-center text-grey mx-3 rounded",
            "group transition duration-300",
            "hover:text-primary-light",
            "focus-outline-offset focus:text-light focus:outline-offset-2",
          )}
          overrideClassName
          innerRef={buttonRef}
        >
          <Reset className={clsx("motion-safe:group-hover:-rotate-260", "group-focus:text-light")} />
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
