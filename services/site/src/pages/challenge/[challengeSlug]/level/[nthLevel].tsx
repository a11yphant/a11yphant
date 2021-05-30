import Button from "app/components/buttons/Button";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  Code,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQueryResult,
  LevelByChallengeSlugQueryVariables,
  useChallengeBySlugQuery,
  useLevelByChallengeSlugQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import { useChallenge } from "app/lib/ChallengeContext";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useSubmitMutation } from "../../../../generated/graphql";

const Level: React.FunctionComponent = () => {
  const router = useRouter();
  const { challengeSlug, nthLevel } = router.query;

  const {
    loading,
    data: { level },
  } = useLevelByChallengeSlugQuery({ variables: { challengeSlug: challengeSlug as string, nth: Number(nthLevel) } });

  const {
    loading: loadingChallenge,
    data: { challenge },
  } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const [submitLevelMutation] = useSubmitMutation();

  const challengeContext = useChallenge();

  const [initialCode] = useState<Code>(level?.code);

  const [currHtmlCode, setCurrHtmlCode] = useState<string>(level.lastSubmission?.html || level?.code?.html);
  const [currCssCode, setCurrCssCode] = useState<string>(level.lastSubmission?.css || level?.code?.css);
  const [currJavascriptCode, setCurrJavascriptCode] = useState<string>(level.lastSubmission?.js || level?.code?.js);

  const resetToInitialCode = (language?: EditorLanguage): void => {
    // if language === undefined => reset all
    const newCode: Code = !language
      ? initialCode
      : {
          html: currHtmlCode,
          css: currCssCode,
          js: currJavascriptCode,
        };

    if (language) {
      newCode[language] = initialCode[language];
    }

    setCurrHtmlCode(newCode.html);
    setCurrCssCode(newCode.css);
    setCurrJavascriptCode(newCode.js);
  };

  const submitLevel = async (): Promise<void> => {
    const { data } = await submitLevelMutation({
      variables: {
        submissionInput: {
          levelId: level.id,
          html: currHtmlCode,
          css: currCssCode,
          js: currJavascriptCode,
        },
      },
    });

    challengeContext.setSubmissionId(data.submit.id);
    router.push(`${router.asPath}/evaluation`);
  };

  if (loading || loadingChallenge) {
    return <div>Loading ...</div>;
  }

  const editorConfiguration = [];

  if (level.hasHtmlEditor) {
    editorConfiguration.push({
      languageLabel: "HTML",
      language: EditorLanguage.html,
      code: currHtmlCode,
      updateCode: setCurrHtmlCode,
      heading: "index.html",
    });
  }

  if (level.hasCssEditor) {
    editorConfiguration.push({
      languageLabel: "CSS",
      language: EditorLanguage.css,
      code: currCssCode,
      updateCode: setCurrCssCode,
      heading: "index.css",
    });
  }

  if (level.hasJsEditor) {
    editorConfiguration.push({
      languageLabel: "JavaScript",
      language: EditorLanguage.javascript,
      code: currJavascriptCode,
      updateCode: setCurrJavascriptCode,
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
      <main className="flex justify-between h-main box-border p-4">
        <Sidebar className="h-full" challengeName={challenge.name} level={level} />
        <div className="flex justify-between flex-col flex-auto h-full box-border pl-4 relative">
          <Editors
            reset={resetToInitialCode}
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
          <Preview className="w-full h-2/5" heading="Preview" htmlCode={currHtmlCode} cssCode={currCssCode} javascriptCode={""} />
          <div className="absolute right-0 bottom-0 pt-2 pl-2 pr-0 pb-0 bg-background border-light border-t-2 border-l-2 rounded-tl-xl">
            <Button full onClick={submitLevel} className="px-10">
              Submit
            </Button>
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
