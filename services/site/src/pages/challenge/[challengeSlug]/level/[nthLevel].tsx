import { isCodeLevel, isQuizLevel } from "app/components/challenge/helpers";
import CodeLevel from "app/components/challenge/level/CodeLevel";
import QuizLevel from "app/components/challenge/level/QuizLevel";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQuery,
  LevelByChallengeSlugQueryVariables,
  useChallengeBySlugQuery,
  useLevelByChallengeSlugQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import { getClientConfig } from "app/lib/config";
import { getConfig } from "app/lib/config/rsc";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const Level: React.FunctionComponent = () => {
  const router = useRouter();
  const { challengeSlug, nthLevel } = router.query;
  const [autoSaveLoading, setAutoSaveLoading] = React.useState<boolean>(false);

  const {
    loading: loadingChallenge,
    data: { challenge },
  } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const {
    loading,
    data: { level },
  } = useLevelByChallengeSlugQuery({
    variables: { challengeSlug: challengeSlug as string, nth: Number(nthLevel) },
  });

  if (loading || loadingChallenge) {
    return <div>Loading ...</div>;
  }

  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  const header = <Navigation displayBreadcrumbs isSticky={false} />;

  return (
    <>
      <Head>
        <title>
          {challenge.name} - Level {nthLevel} | a11yphant
        </title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="Various accessibility topics are split up into short challenges. Solve coding levels and single-choice quizzes, with each challenge teaching you one thing at a time."
        />
        <meta property="og:title" content={`${challenge.name} - Level ${nthLevel}`} />
        <meta
          property="og:description"
          content="Various accessibility topics are split up into short challenges. Solve coding levels and single-choice quizzes, with each challenge teaching you one thing at a time."
        />
        <meta property="og:image" content="/images/SEO/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        <meta property="og:locale" content="en" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://a11yphant.com/challenge/${challenge.name}/level/${nthLevel}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <FullScreenLayout header={header}>
        <main className={clsx("max-h-full h-full px-4 pb-4 flex flex-col md:flex-row justify-between box-border")}>
          <h1 className={clsx("sr-only")}>{`${challenge.name} - Level ${nthLevel}`}</h1>
          {isCodeLevel(level) && (
            <CodeLevel challengeName={challenge.name} level={level} onAutoSaveLoadingChange={setAutoSaveLoading} autoSave={autoSaveLoading} />
          )}
          {isQuizLevel(level) && <QuizLevel question={level.question} answers={level.answerOptions} isLastLevel={isLastLevel} levelId={level.id} />}
        </main>
      </FullScreenLayout>
    </>
  );
};

export default Level;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(getConfig().graphqlEndpointServer, null, context);

  const { challengeSlug, nthLevel } = context.params;

  const [, levelResult, challengeResult] = await Promise.all([
    getServerSideCurrentUser(apolloClient),
    apolloClient.query<LevelByChallengeSlugQuery, LevelByChallengeSlugQueryVariables>({
      query: LevelByChallengeSlugDocument,
      variables: {
        challengeSlug: challengeSlug as string,
        nth: Number(nthLevel),
      },
    }),
    apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
      query: ChallengeBySlugDocument,
      variables: {
        slug: challengeSlug as string,
      },
    }),
  ]);

  if (!challengeResult.data.challenge || !levelResult.data.level) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displaySave: true,
      showScrollOverlay: false,
      config: getClientConfig(),
    },
  };
};
