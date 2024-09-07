"use client";

import LoadingButton from "app/components/buttons/LoadingButton";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import { LocalErrorScopeApolloContext } from "app/components/common/error/ErrorScope";
import { useErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessageEnum, getFlashMessage } from "app/components/common/flashMessage/messages/getFlashMessage";
import { CodeLevelDetailsFragment, useRequestCodeLevelCheckMutation } from "app/generated/graphql";
import { getNumFailedLevelsInARowKey } from "app/hooks/sessionState/sessionStateKeys";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
import { useSubmissionAutoSave } from "app/hooks/useSubmissionAutoSave";
import clsx from "clsx";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";

export interface CodeLevelProps {
  challengeName: string;
  level: CodeLevelDetailsFragment;
}

const CodeLevel = ({ challengeName, level }: CodeLevelProps): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const { challengeSlug, nthLevel } = useParams();
  const errorDialogApi = useErrorDialogApi();
  const flashMessageApi = useFlashMessageApi();
  const [failedLevelsInARow] = useSessionState<number>(getNumFailedLevelsInARowKey(challengeSlug as string, nthLevel as string), 0);

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
    if (failedLevelsInARow >= 2) {
      setTimeout(() => {
        const { message, type } = getFlashMessage(FlashMessageEnum.HINT_REMINDER);
        flashMessageApi.show(message, {
          type,
          className: clsx("flex"),
          offsetElementClassName: clsx("block"),
        });
      }, 1000);
    }

    return () => {
      flashMessageApi.hide();
    };
  }, [failedLevelsInARow]);

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

  const [requestCheckMutation, { loading: requestCheckMutationLoading }] = useRequestCodeLevelCheckMutation({
    context: LocalErrorScopeApolloContext,
    onError: (error) => {
      errorDialogApi.showApolloError(error, {
        defaultMessage: (
          <>
            <strong>Submission Error.</strong> A problem occurred while checking this submission. Please try again later.
          </>
        ),
      });
    },
  });

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
    await updateSubmission();

    const { errors } = await requestCheckMutation({
      variables: { requestCheckInput: { submissionId } },
    });

    if (errors === undefined) {
      router.push(`${pathname}/evaluation/${submissionId}`);
    }
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
      <Sidebar className={clsx("h-full block mb-4 md:mb-0")} challengeName={challengeName} level={level} />
      <div className={clsx("w-full flex")}>
        <div className={clsx("h-full md:pl-4 relative box-border justify-between flex-col flex-auto")}>
          <Editors
            onReset={resetToInitialCode}
            className={clsx("w-full h-[30rem] md:h-3/5")}
            editors={editorConfiguration}
            theme="light"
            options={{
              lineHeight: 24,
              fontSize: 16,
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
            }}
            autoSave={autoSaveLoading}
          />
          <Preview
            className={clsx("w-full h-80 md:h-2/5")}
            heading="Preview"
            htmlCode={submissionCode?.html}
            cssCode={submissionCode?.css}
            javascriptCode={submissionCode?.js}
          />
          <div className={clsx("absolute right-0 bottom-0 pt-2 pl-2 pr-0 pb-0 bg-background border-light border-t-2 border-l-2 rounded-tl-xl")}>
            <LoadingButton
              primary
              onClick={submitLevel}
              loading={requestCheckMutationLoading}
              disabled={!submissionId}
              submitButton
              srTextLoading="The submission is being processed."
            >
              Submit
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeLevel;
