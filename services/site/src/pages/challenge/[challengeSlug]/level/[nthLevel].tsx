import ButtonLoading from "app/components/buttons/ButtonLoading";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import IllustrationCodingWoman from "app/components/icons/IllustrationCodingWoman";
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
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
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

  // button with loading spinner
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const submitLevel = async (): Promise<void> => {
    setLoadingAnimation(true);

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

    router.push(`${router.asPath}/evaluation/${data.submit.id}`);
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

  const smallScreenNotification = (
    <>
      <section className={clsx("mx-8 py-10 h-full flex flex-col justify-center items-left", "md:hidden")}>
        <IllustrationCodingWoman className={clsx("max-w-xs mb-12 self-start", "sm:mb-12 sm:max-w-sm")} />
        <h2 className={clsx("mb-8", "h3", "sm:h2")}>Your device is too small</h2>
        <p>Please use a tablet or desktop device with a larger screen.</p>
        <Link href="/">
          <a
            className={clsx(
              "w-max mt-4 px-4 py-2 font-normal bg-primary text-white border-primary border-2 rounded tracking-wider inline-flex items-center",
              "transition duration-300",
              "hover:text-white hover:bg-primary-dark hover:border-primary-dark",
              "focus:text-white focus:bg-primary-dark focus:border-primary-dark",
            )}
          >
            Go to homepage
          </a>
        </Link>
      </section>
    </>
  );

  return (
    <>
      <Head>
        <title>
          {challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <main className={clsx("h-main md:p-4 md:flex md:justify-between md:box-border")}>
        {smallScreenNotification}
        <Sidebar className={clsx("h-full", "hidden md:block")} challengeName={challenge.name} level={level} />
        <div className={clsx("h-full pl-4 relative box-border flex justify-between flex-col flex-auto", "hidden md:block")}>
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
          <Preview className="w-full h-2/5" heading="Preview" htmlCode={currHtmlCode} cssCode={currCssCode} javascriptCode={""} />
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
