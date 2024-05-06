import Footer from "app/components/Footer";
import Navigation from "app/components/Navigation";
import {
  ChallengeStatus as ChallengeStatusEnum,
  ChallengesWithStatusForUserDocument,
  ChallengesWithStatusForUserQuery,
  ChallengesWithStatusForUserQueryVariables,
  useChallengesWithStatusForUserQuery,
  UserByIdDocument,
  UserByIdQuery,
  UserByIdQueryVariables,
  useUserByIdQuery,
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

// Workaround due to ts-jests issues with enums: https://github.com/kulshekhar/ts-jest/issues/1357#issuecomment-580736356
const ChallengeStatus = { ...ChallengeStatusEnum };

const Challenge: React.FunctionComponent = () => {
  const router = useRouter();

  const userId = router.query.userId;

  const {
    data: { user },
  } = useUserByIdQuery({
    variables: {
      id: userId as string,
    },
  });

  const {
    data: { challenges },
  } = useChallengesWithStatusForUserQuery({
    variables: {
      userId: userId as string,
    },
  });

  const openChallenges = challenges.filter((challenge) => challenge.statusForUser === ChallengeStatus.Open);
  const startedChallenges = challenges.filter((challenge) => challenge.statusForUser === ChallengeStatus.InProgress);
  const completedChallenges = challenges.filter((challenge) => challenge.statusForUser === ChallengeStatus.Finished);
  const totalChallenges = challenges.length;

  return (
    <>
      <Head>
        <title>{user.displayName || "Anonymous user"}'s profile | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content={`${user.displayName || "An anonymous user"} shared their progress on a11yphant with you. Join them and start learning about web accessibility today!`}
        />
        <meta name="author" content="a11yphant" />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={`https://a11yphant.com/${user.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:site_name" content="a11yphant" />
        <meta property="og:title" content={`${user.displayName || "An anonymous user"}'s profile | a11yphant`} />
        <meta
          property="og:description"
          content={`${user.displayName || "An anonymous user"} shared their progress on a11yphant with you. Join them and start learning about web accessibility today!`}
        />
        <meta property="og:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A screenshot compilation of the homepage, a quiz and a coding level on a11yphant. The homepage shows an illustration of a person coding and the text `learning web accessibility made easy`. The quiz is multiple choice and the coding level consists of an instruction section, a code editor and a preview section to view the code one has just written."
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@a11yphant" />
        <meta name="twitter:title" content={`${user.displayName || "An anonymous user"}'s profile | a11yphant`} />
        <meta
          name="twitter:description"
          content={`${user.displayName || "An anonymous user"} shared their progress on a11yphant with you. Join them and start learning about web accessibility today!`}
        />
        <meta name="twitter:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto mt-32")}>
        <div className={clsx("mx-8 h-main max-w-screen-3xl mt-12", "sm:mx-12 sm:mt-24", "lg:mx-24")}>
          <div className={clsx("flex flex-col justify-between content-start pb-6 mb-20 border-grey-light border-b", "md:flex-row md:content-end")}>
            <div className={clsx("md:self-end")}>
              <h1 className={clsx("pb-2.5 pr-4 text-grey", "h3", "sm:h2")}>{user.displayName || "Anonymous coder"}</h1>
              <p className={clsx("text-grey-middle")}>Is learning to code accessibly</p>
            </div>

            <div className={clsx("hidden", "md:flex md:flex-col")}>
              <h2 className={clsx("font-normal text-right", "h4", "md:mb-2", "lg:h3")}>
                finished <br /> challenges
              </h2>
              <p className={clsx("font-mono", "h1 font-normal", "sm:text-8xl", "md:text-right")}>
                {completedChallenges.length}/{totalChallenges} <span className="sr-only">challenges</span>
              </p>
            </div>
          </div>
          <h2 className={clsx("mb-6", "h4", "sm:h3")}>Challenges</h2>
          {completedChallenges.length > 0 && (
            <div>
              <h3 className={clsx("mb-2.5", "h5", "sm:h4")}>Completed</h3>
              <ul className={clsx("list-disc ml-6 mb-16")}>
                {challenges.map(
                  (challenge) =>
                    challenge.statusForUser === ChallengeStatus.Finished && (
                      <li key={challenge.id} className={clsx("m-0 my-4")}>
                        {challenge.name}
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
          {startedChallenges.length > 0 && (
            <div>
              <h3 className={clsx("mb-2.5", "h5", "sm:h4")}>Currently coding</h3>
              <ul className={clsx("list-disc ml-6 mb-16")}>
                {challenges.map(
                  (challenge) =>
                    challenge.statusForUser === ChallengeStatus.InProgress && (
                      <li key={challenge.id} className={clsx("m-0 my-4")}>
                        {challenge.name}
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
          {openChallenges.length > 0 && (
            <div>
              <h3 className={clsx("mb-2.5", "h5", "sm:h4")}>Not started yet</h3>
              <ul className={clsx("list-disc ml-6 mb-4")}>
                {challenges.map(
                  (challenge) =>
                    challenge.statusForUser === ChallengeStatus.Open && (
                      <li key={challenge.id} className={clsx("m-0 my-4")}>
                        {challenge.name}
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(getConfig().getGraphqlEndpointUrl(context.req.headers.host), null, context);

  const { userId } = context.params;

  const {
    data: { user },
  } = await apolloClient.query<UserByIdQuery, UserByIdQueryVariables>({
    query: UserByIdDocument,
    variables: {
      id: userId as string,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  await Promise.all([
    getServerSideCurrentUser(apolloClient),
    apolloClient.query<ChallengesWithStatusForUserQuery, ChallengesWithStatusForUserQueryVariables>({
      query: ChallengesWithStatusForUserDocument,
      variables: {
        userId: userId as string,
      },
    }),
  ]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displayBreadcrumbs: false,
      config: getClientConfig(),
    },
  };
};

export default Challenge;
