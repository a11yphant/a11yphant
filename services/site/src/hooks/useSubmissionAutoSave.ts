import { Submission, useCreateSubmissionMutation, useUpdateSubmissionMutation } from "app/generated/graphql";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

const debounceOneSecond = debounce((update: () => void) => {
  update();
}, 1000);

type SubmissionCode = Pick<Submission, "html" | "css" | "js">;

export function useSubmissionAutoSave(): {
  setLevelId: (string) => void;
  submissionId: string;
  setSubmissionId: (string) => void;
  submissionCode: SubmissionCode;
  setSubmissionCode: (SubmissionCode) => void;
  updateSubmission: () => Promise<void>;
} {
  const [createSubmissionMutation, { loading: createSubmissionLoading }] = useCreateSubmissionMutation();
  const [updateSubmissionMutation, { loading: updateSubmitMutationLoading }] = useUpdateSubmissionMutation();
  const [levelId, setLevelId] = useState<string>();
  const [submissionId, setSubmissionId] = useState<string>();
  const [submissionCode, setSubmissionCode] = useState<SubmissionCode>();

  const updateSubmission = async (): Promise<void> => {
    if (!submissionId && !createSubmissionLoading) {
      const { data } = await createSubmissionMutation({
        variables: {
          submissionInput: {
            levelId,
            ...submissionCode,
          },
        },
      });

      return setSubmissionId(data.createSubmission.submission.id);
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

  useEffect(() => {
    debounceOneSecond(() => {
      updateSubmission();
    });
  }, [submissionCode]);

  return {
    setLevelId,
    submissionId,
    setSubmissionId,
    submissionCode,
    setSubmissionCode,
    updateSubmission,
  };
}
