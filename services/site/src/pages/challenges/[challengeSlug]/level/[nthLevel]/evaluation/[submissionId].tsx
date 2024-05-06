import { ApolloError } from "@apollo/client";
import EndOfChallengeFlashMessage from "app/components/challenge/EndOfChallengeFlashMessage";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  ResultForSubmissionDocument,
  ResultForSubmissionQuery,
  ResultForSubmissionQueryVariables,
  ResultStatus,
  useChallengeBySlugQuery,
} from "app/generated/graphql";
import { getNumFailedLevelsInARowKey } from "app/hooks/sessionState/sessionStateKeys";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
import { initializeApollo } from "app/lib/apollo-client";
import { getClientConfig } from "app/lib/config";
import { getConfig } from "app/lib/config/rsc";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

export interface EvaluationRouterParams {
  challengeSlug?: string;
  nthLevel?: string;
  submissionId?: string;
}

const Evaluation: React.FunctionComponent = () => {
  const router = useRouter();
  const flashMessageApi = useFlashMessageApi();
  const { challengeSlug, nthLevel, submissionId }: EvaluationRouterParams = router.query;
  const [, setFailedLevelsInARow] = useSessionState<number>(getNumFailedLevelsInARowKey(challengeSlug as string, nthLevel as string), 0);

  const { data } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const submissionResult = usePollSubmissionResult(submissionId);

  const isLastLevel = parseInt(nthLevel as string) + 1 > data?.challenge.levels.length;

  const pageTitle = `Evaluation - ${data?.challenge.name} - Level ${nthLevel}`;
  const heading = <h1 className={clsx("sr-only")}>{pageTitle}</h1>;

  React.useEffect(() => {
    if (submissionResult?.status === ResultStatus.Fail) {
      setFailedLevelsInARow((prev) => (prev ? prev + 1 : 1));
    } else if (submissionResult?.status === ResultStatus.Success) {
      setFailedLevelsInARow(0);
    }

    if (isLastLevel && submissionResult?.status === ResultStatus.Success) {
      flashMessageApi.show(<EndOfChallengeFlashMessage />);
    }
  }, [submissionResult?.status, data?.challenge?.levels?.length]);

  return (
    <>
      <Head>
        <title>{pageTitle} | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
        {/* <!-- General Meta Tags --> */}
        <meta name="author" content="a11yphant" />
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <FullScreenLayout header={<Navigation displayBreadcrumbs isSticky={false} />}>
        {data === undefined || submissionResult === undefined || submissionResult.status === ResultStatus.Pending ? (
          <>
            <main className={clsx("h-full", "md:p-4 md:pt-0 md:flex md:flex-col md:justify-between")}>
              {heading}
              <LoadingScreen className={clsx("flex")} />
            </main>
          </>
        ) : (
          <>
            <main
              className={clsx("h-full max-w-screen-3xl mx-auto px-5", "sm:px-8", "md:px-12 md:pt-12 md:pb-4 md:flex md:flex-col md:justify-between")}
            >
              {heading}
              <EvaluationHeader
                className={clsx("flex")}
                challengeName={data.challenge.name}
                levelIdx={Number(nthLevel)}
                score={submissionResult.totalScore}
                passed={submissionResult.status === ResultStatus.Success}
              />
              <ScrollOverlayWrapper
                className={clsx(
                  "h-full max-w-7xl m-auto pt-8 lg:pt-20 mt-0 mb-4 flex flex-col items-left w-full box-border overflow-auto overscroll-none",
                )}
                classNameBottomOverlay={"w-full h-52 shrink-0 -mt-52"}
                enableTopOverlay={false}
              >
                <EvaluationBody requirements={submissionResult.requirements} />
              </ScrollOverlayWrapper>
              <div className={clsx("mb-8 flex lg:absolute lg:bottom-4 lg:right-4 lg:block")}>
                <CompleteEvaluationButton status={submissionResult.status} isLastLevel={isLastLevel} />
              </div>
            </main>
          </>
        )}
      </FullScreenLayout>
    </>
  );
};

export default Evaluation;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(getConfig().getGraphqlEndpointUrl(context.req.headers.host), null, context);

  const { challengeSlug, submissionId } = context.params;

  try {
    const [, challenge, result] = await Promise.all([
      getServerSideCurrentUser(apolloClient),
      apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
        query: ChallengeBySlugDocument,
        variables: {
          slug: challengeSlug as string,
        },
      }),
      apolloClient.query<ResultForSubmissionQuery, ResultForSubmissionQueryVariables>({
        query: ResultForSubmissionDocument,
        variables: {
          id: submissionId as string,
        },
      }),
    ]);

    if (!result.data.resultForSubmission || !challenge.data.challenge) {
      return {
        notFound: true,
      };
    }
  } catch (e) {
    if (e instanceof ApolloError && e.graphQLErrors.find((error) => error.extensions.code === "BAD_USER_INPUT")) {
      return {
        notFound: true,
      };
    }
    throw e;
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      showScrollOverlay: false,
      config: getClientConfig(),
    },
  };
};
