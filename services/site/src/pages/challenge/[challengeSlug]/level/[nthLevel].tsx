import ButtonLoading from "app/components/buttons/ButtonLoading";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQueryResult,
  LevelByChallengeSlugQueryVariables,
  useChallengeBySlugQuery,
  useLevelByChallengeSlugQuery,
  useRequestCheckMutation,
} from "app/generated/graphql";
import { useSubmissionAutoSave } from "app/hooks/useSubmissionAutoSave";
import { initializeApollo } from "app/lib/apollo-client";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Level: React.FunctionComponent = () => {
  const router = useRouter();
  const { challengeSlug, nthLevel } = router.query;

  const { setLevelId, submissionId, setSubmissionId, setSubmissionCode, submissionCode, updateSubmission } = useSubmissionAutoSave();

  const {
    loading,
    data: { level },
  } = useLevelByChallengeSlugQuery({
    variables: { challengeSlug: challengeSlug as string, nth: Number(nthLevel) },
    onCompleted: ({ level }) => {
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
    },
  });

  const {
    loading: loadingChallenge,
    data: { challenge },
  } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const [requestCheckMutation] = useRequestCheckMutation();

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

  const [showSubmitLoadingAnimation, setShowSubmitLoadingAnimation] = useState(false);

  const submitLevel = async (): Promise<void> => {
    setShowSubmitLoadingAnimation(true);

    await updateSubmission();

    await requestCheckMutation({
      variables: { requestCheckInput: { submissionId } },
    });

    router.push(`${router.asPath}/evaluation/${submissionId}`);
  };

  if (loading || loadingChallenge) {
    return <div>Loading ...</div>;
  }

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
      <Head>
        <title>
          {challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <main className={clsx("h-main", "md:p-4 md:flex md:justify-between md:box-border")}>
        <SmallScreenNotification />
        <Sidebar className={clsx("h-full hidden", "md:block")} challengeName={challenge.name} level={level} />
        <div className={clsx("h-full pl-4 relative box-border hidden justify-between flex-col flex-auto", "md:flex")}>
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
