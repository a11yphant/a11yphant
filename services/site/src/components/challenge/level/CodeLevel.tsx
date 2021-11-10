import ButtonLoading from "app/components/buttons/ButtonLoading";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import { CodeLevelDetailsFragment, useRequestCodeLevelCheckMutation } from "app/generated/graphql";
import { useSubmissionAutoSave } from "app/hooks/useSubmissionAutoSave";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface CodeLevelProps {
  challengeName: string;
  level: CodeLevelDetailsFragment;
  onAutoSaveLoadingChange: (autoSaveLoading: boolean) => void;
}

const CodeLevel = ({ challengeName, level, onAutoSaveLoadingChange }: CodeLevelProps): React.ReactElement => {
  const router = useRouter();

  const {
    setLevelId,
    submissionId,
    setSubmissionId,
    setSubmissionCode,
    submissionCode,
    updateSubmission,
    loading: autoSaveLoading,
  } = useSubmissionAutoSave();

  React.useEffect(() => {
    onAutoSaveLoadingChange(autoSaveLoading);
  }, [autoSaveLoading, onAutoSaveLoadingChange]);

  React.useEffect(() => {
    setLevelId(level.id);
    if (level?.lastSubmission) {
      setSubmissionCode({
        html: level.lastSubmission.html,
        js: level.lastSubmission.js,
        css: level.lastSubmission.css,
      });

      if (level.lastSubmission.result) {
        return;
      }

      setSubmissionId(level.lastSubmission.id);
    } else {
      setSubmissionCode({
        html: level.code?.html,
        js: level.code?.js,
        css: level.code?.css,
      });
    }
  }, [level, setLevelId, setSubmissionCode, setSubmissionId]);

  const [requestCheckMutation] = useRequestCodeLevelCheckMutation();

  const [showSubmitLoadingAnimation, setShowSubmitLoadingAnimation] = useState(false);

  const resetToInitialCode = (language?: EditorLanguage): void => {
    if (language) {
      setSubmissionCode({
        ...submissionCode,
        [language]: level.code?.[language],
      });
    } else {
      setSubmissionCode({
        html: level.code?.html,
        js: level.code?.js,
        css: level.code?.css,
      });
    }
  };

  const submitLevel = async (): Promise<void> => {
    setShowSubmitLoadingAnimation(true);

    await updateSubmission();

    await requestCheckMutation({
      variables: { requestCheckInput: { submissionId } },
    });

    router.push(`${router.asPath}/evaluation/${submissionId}`);
  };

  const editorConfiguration = [];

  if (level.hasHtmlEditor) {
    editorConfiguration.push({
      languageLabel: "HTML",
      language: EditorLanguage.html,
      code: submissionCode?.html,
      updateCode: (html) => {
        setSubmissionCode({ ...submissionCode, html });
      },
      heading: "index.html",
    });
  }

  if (level.hasCssEditor) {
    editorConfiguration.push({
      languageLabel: "CSS",
      language: EditorLanguage.css,
      code: submissionCode?.css,
      updateCode: (css) => {
        setSubmissionCode({ ...submissionCode, css });
      },
      heading: "index.css",
    });
  }

  if (level.hasJsEditor) {
    editorConfiguration.push({
      languageLabel: "JavaScript",
      language: EditorLanguage.javascript,
      code: submissionCode?.js,
      updateCode: (js) => {
        setSubmissionCode({ ...submissionCode, js });
      },
      heading: "index.js",
    });
  }

  return (
    <>
      <Sidebar className={clsx("h-full hidden", "lg:block")} challengeName={challengeName} level={level} />
      <div className={clsx("w-full hidden", "lg:flex")}>
        <div className="h-full pl-4 relative box-border justify-between flex-col flex-auto">
          <Editors
            onReset={resetToInitialCode}
            className="w-full h-3/5"
            editors={editorConfiguration}
            theme="light"
            options={{
              lineHeight: 24,
              fontSize: 12,
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
            }}
          />
          <Preview
            className="w-full h-2/5"
            heading="Preview"
            htmlCode={submissionCode?.html}
            cssCode={submissionCode?.css}
            javascriptCode={submissionCode?.js}
          />
          <div className="absolute right-0 bottom-0 pt-2 pl-2 pr-0 pb-0 bg-background border-light border-t-2 border-l-2 rounded-tl-xl">
            <ButtonLoading
              primary
              onClick={submitLevel}
              className="px-10"
              loading={showSubmitLoadingAnimation}
              submitButton
              srTextLoading="The submission is being processed."
            >
              Submit
            </ButtonLoading>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeLevel;
