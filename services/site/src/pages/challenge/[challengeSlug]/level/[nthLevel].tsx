import ButtonLoading from "app/components/buttons/ButtonLoading";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQuery,
  LevelByChallengeSlugQueryResult,
  LevelByChallengeSlugQueryVariables,
  UpdateSubmissionInput,
  useChallengeBySlugQuery,
  useCreateSubmissionMutation,
  useLevelByChallengeSlugQuery,
  useRequestCheckMutation,
  useUpdateSubmissionMutation,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import debounce from "lodash.debounce";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface EditorCode {
  html?: string;
  js?: string;
  css?: string;
}

const debounceOneSecond = debounce((update: () => void) => {
  update();
}, 1000);

const Level: React.FunctionComponent = () => {
  const router = useRouter();
  const { challengeSlug, nthLevel } = router.query;

  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>();
  const [editorCode, setEditorCode] = useState<EditorCode>();

  const { loading, data: levelData } = useLevelByChallengeSlugQuery({
    variables: { challengeSlug: challengeSlug as string, nth: Number(nthLevel) },
    fetchPolicy: "network-only",
    onCompleted: ({ level }) => {
      if (level?.lastSubmission) {
        setCurrentSubmissionId(level.lastSubmission.id);
        setEditorCode({
          html: level.lastSubmission.html,
          js: level.lastSubmission.js,
          css: level.lastSubmission.css,
        });
      } else {
        setEditorCode({
          html: level.code?.html,
          js: level.code?.js,
          css: level.code?.css,
        });
      }
    },
  });

  const {
    loading: loadingChallenge,
    data: { challenge },
  } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const [createSubmissionMutation, { loading: createSubmissionLoading }] = useCreateSubmissionMutation();
  const [updateSubmissionMutation, { loading: updateSubmitMutationLoading }] = useUpdateSubmissionMutation();
  const [requestCheckMutation] = useRequestCheckMutation();

  const updateSubmission = async (submissionInput: UpdateSubmissionInput): Promise<void> => {
    await updateSubmissionMutation({
      variables: {
        submissionInput,
      },
      update: (cache, { data }) => {
        const variables = {
          challengeSlug: challengeSlug as string,
          nth: Number(nthLevel),
        };

        const entry = cache.readQuery<LevelByChallengeSlugQuery>({
          query: LevelByChallengeSlugDocument,
          variables,
        });

        const updatedEntry = {
          ...entry,
          level: {
            ...entry.level,
            lastSubmission: {
              ...entry.level.lastSubmission,
              ...data?.updateSubmission.submission,
            },
          },
        };

        cache.writeQuery({
          query: LevelByChallengeSlugDocument,
          variables,
          data: updatedEntry,
        });
      },
    });
  };

  const autoSaveCode = async (editorCode: EditorCode): Promise<void> => {
    if (!currentSubmissionId && !createSubmissionLoading) {
      const { data } = await createSubmissionMutation({
        variables: {
          submissionInput: {
            levelId: levelData.level.id,
            ...editorCode,
          },
        },
      });
      setCurrentSubmissionId(data.createSubmission.submission.id);
      return;
    }

    if (updateSubmitMutationLoading) {
      return;
    }

    await updateSubmission({
      id: currentSubmissionId,
      ...editorCode,
    });
  };

  useEffect(() => {
    debounceOneSecond(() => {
      autoSaveCode(editorCode);
    });
  }, [editorCode]);

  const resetToInitialCode = (language?: EditorLanguage): void => {
    if (language) {
      setEditorCode({
        ...editorCode,
        [language]: levelData.level.code?.[language],
      });
    } else {
      setEditorCode({
        html: levelData.level.code?.html,
        js: levelData.level.code?.js,
        css: levelData.level.code?.css,
      });
    }
  };

  // button with loading spinner
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const submitLevel = async (): Promise<void> => {
    setLoadingAnimation(true);

    await updateSubmission({
      id: currentSubmissionId,
      ...editorCode,
    });

    await requestCheckMutation({
      variables: { requestCheckInput: { submissionId: currentSubmissionId } },
    });

    router.push(`${router.asPath}/evaluation/${currentSubmissionId}`);
  };

  if (loading || loadingChallenge) {
    return <div>Loading ...</div>;
  }

  const editorConfiguration = [];

  if (levelData.level.hasHtmlEditor) {
    editorConfiguration.push({
      languageLabel: "HTML",
      language: EditorLanguage.html,
      code: editorCode?.html,
      updateCode: (html) => {
        setEditorCode({ ...editorCode, html });
      },
      heading: "index.html",
    });
  }

  if (levelData.level.hasCssEditor) {
    editorConfiguration.push({
      languageLabel: "CSS",
      language: EditorLanguage.css,
      code: editorCode?.css,
      updateCode: (css) => {
        setEditorCode({ ...editorCode, css });
      },
      heading: "index.css",
    });
  }

  if (levelData.level.hasJsEditor) {
    editorConfiguration.push({
      languageLabel: "JavaScript",
      language: EditorLanguage.javascript,
      code: editorCode?.js,
      updateCode: (js) => {
        setEditorCode({ ...editorCode, js });
      },
      heading: "index.js",
    });
  }

  return (
    <>
      <Head>
        <title>
          {challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <main className="h-main p-4 flex justify-between box-border">
        <Sidebar className="h-full" challengeName={challenge.name} level={levelData.level} />
        <div className="h-full pl-4 relative box-border flex justify-between flex-col flex-auto">
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
          <Preview className="w-full h-2/5" heading="Preview" htmlCode={editorCode?.html} cssCode={editorCode?.css} javascriptCode={editorCode?.js} />
          <div className="absolute right-0 bottom-0 pt-2 pl-2 pr-0 pb-0 bg-background border-light border-t-2 border-l-2 rounded-tl-xl">
            <ButtonLoading
              primary
              onClick={submitLevel}
              className="px-10"
              loading={loadingAnimation}
              submitButton
              srTextLoading="The submission is being processed."
            >
              Submit
            </ButtonLoading>
          </div>
        </div>
      </main>
    </>
  );
};

export default Level;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  const { challengeSlug, nthLevel } = context.params;

  await apolloClient.query<LevelByChallengeSlugQueryResult, LevelByChallengeSlugQueryVariables>({
    query: LevelByChallengeSlugDocument,
    variables: {
      challengeSlug: challengeSlug as string,
      nth: Number(nthLevel),
    },
  });

  await apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
    query: ChallengeBySlugDocument,
    variables: {
      slug: challengeSlug as string,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displaySave: true,
    },
  };
};
