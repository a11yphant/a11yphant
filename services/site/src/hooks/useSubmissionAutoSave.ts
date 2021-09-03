import { Submission, UpdateSubmissionInput, useCreateSubmissionMutation, useUpdateSubmissionMutation } from "app/generated/graphql";
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

  const updateSubmission = async (submissionInput: UpdateSubmissionInput): Promise<void> => {
    await updateSubmissionMutation({
      variables: {
        submissionInput,
      },
      //   update: (cache, { data }) => {
      //     const variables = {
      //       challengeSlug: challengeSlug as string,
      //       nth: Number(nthLevel),
      //     };

      //     const entry = cache.readQuery<LevelByChallengeSlugQuery>({
      //       query: LevelByChallengeSlugDocument,
      //       variables,
      //     });

      //     const updatedEntry = {
      //       ...entry,
      //       level: {
      //         ...entry.level,
      //         lastSubmission: {
      //           ...entry.level.lastSubmission,
      //           ...data?.updateSubmission.submission,
      //         },
      //       },
      //     };

      //     cache.writeQuery({
      //       query: LevelByChallengeSlugDocument,
      //       variables,
      //       data: updatedEntry,
      //     });
      //   },
    });
  };

  const autoSaveCode = async (editorCode: SubmissionCode): Promise<void> => {
    if (!submissionId && !createSubmissionLoading) {
      const { data } = await createSubmissionMutation({
        variables: {
          submissionInput: {
            levelId,
            ...editorCode,
          },
        },
      });
      setSubmissionId(data.createSubmission.submission.id);
      return;
    }

    if (updateSubmitMutationLoading) {
      return;
    }

    await updateSubmission({
      id: submissionId,
      ...editorCode,
    });
  };

  useEffect(() => {
    debounceOneSecond(() => {
      autoSaveCode(submissionCode);
    });
  }, [submissionCode]);

  return {
    setLevelId,
    submissionId,
    setSubmissionId,
    setSubmissionCode,
    submissionCode,
    updateSubmission: () => Promise.resolve(),
  };
}
