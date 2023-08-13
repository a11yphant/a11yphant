import { CodeLevelSubmission, useCreateCodeLevelSubmissionMutation, useUpdateCodeLevelSubmissionMutation } from "app/generated/graphql";
import debounce from "lodash.debounce";
import React from "react";

const debounceOneSecond = debounce((update: () => void) => {
  update();
}, 1000);

type SubmissionCode = Pick<CodeLevelSubmission, "html" | "css" | "js">;

interface SubmissionAutoSaveApi {
  setLevelId: (id: string) => void;
  submissionId: string;
  setSubmissionId: (id: string) => void;
  submissionCode: SubmissionCode;
  setSubmissionCode: (code: SubmissionCode) => void;
  updateSubmission: () => Promise<void>;
  loading: boolean;
}

export function useSubmissionAutoSave(): SubmissionAutoSaveApi {
  const [createSubmissionMutation, { loading: createSubmissionLoading }] = useCreateCodeLevelSubmissionMutation();
  const [updateSubmissionMutation, { loading: updateSubmitMutationLoading }] = useUpdateCodeLevelSubmissionMutation();
  const [levelId, setLevelId] = React.useState<string>();
  const [submissionId, setSubmissionId] = React.useState<string>();
  const [submissionCode, setSubmissionCode] = React.useState<SubmissionCode>();
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (createSubmissionLoading || updateSubmitMutationLoading) {
      setLoading(true);
    }

    if (!createSubmissionLoading && !updateSubmitMutationLoading) {
      setLoading(false);
    }
  }, [createSubmissionLoading, updateSubmitMutationLoading]);

  const updateSubmission = async (): Promise<void> => {
    if (!levelId) {
      return;
    }

    if (!submissionId && !createSubmissionLoading) {
      const { data } = await createSubmissionMutation({
        variables: {
          submissionInput: {
            levelId,
            ...submissionCode,
          },
        },
      });

      return setSubmissionId(data.createCodeLevelSubmission.submission.id);
    }

    if (updateSubmitMutationLoading) {
      return;
    }

    await updateSubmissionMutation({
      variables: {
        submissionInput: {
          id: submissionId,
          ...submissionCode,
        },
      },
    });
  };

  React.useEffect(() => {
    debounceOneSecond(() => {
      updateSubmission();
    });
  }, [submissionCode, levelId, submissionId]);

  return {
    setLevelId,
    submissionId,
    setSubmissionId,
    submissionCode,
    setSubmissionCode,
    updateSubmission,
    loading,
  };
}
