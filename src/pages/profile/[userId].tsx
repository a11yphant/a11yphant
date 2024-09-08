import Footer from "app/components/Footer";
import IllustrationRocket from "app/components/icons/IllustrationRocket";
import Navigation from "app/components/Navigation";
import ChallengeStatus from "app/components/user/ChallengeStatus";
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
const ChallengeStatusData = { ...ChallengeStatusEnum };

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

  const openChallenges = challenges.filter((challenge) => challenge.statusForUser === ChallengeStatusData.Open);
  const startedChallenges = challenges.filter((challenge) => challenge.statusForUser === ChallengeStatusData.InProgress);
  const completedChallenges = challenges.filter((challenge) => challenge.statusForUser === ChallengeStatusData.Finished);
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
        {/* <!-- X/Twitter Meta Tags --> */}
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
      <main className={clsx("bg-texture bg-repeat-round bg-contain bg-origin-border bg-top mt-32 pb-8")}>
        <div className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
          <div className={clsx("mx-8 h-main max-w-screen-3xl", "sm:mx-12", "lg:mt-12 lg:mx-24")}>
            <div
              className={clsx(
                "flex flex-col justify-between content-start pb-6 mb-6 border-grey-light border-b",
                "xs:flex-row",
                "md:mb-14 md:content-end",
              )}
            >
              <div className={clsx("md:self-center")}>
                <h1 className={clsx("mb-4 text-grey", "h3 leading-[1.1]", "sm:h2 sm:leading-[1.1]", "md:h1 md:leading-[1.1] sm:mb-2.5 sm:mr-4")}>
                  Your <br></br> accessibility <br></br> journey
                </h1>
              </div>

              <IllustrationRocket
                className={clsx("h-auto w-full max-w-48 -mt-10 self-end", "xs:-mt-2 xs:pl-4", "sm:-mt-6 sm:max-w-60", "md:mt-0 md:max-w-xs")}
              />
            </div>
            <section
              className={clsx("flex flex-col my-6 py-12 px-4 sm:px-6 lg:p-12 container-dark", "sm:my-8", "xl:my-10")}
              aria-label="Profile statistics"
            >
              <div className={clsx("flex justify-between flex-col mb-4", "md:flex-row sm:mb-0")}>
                <div>
                  <h2 className={clsx("pb-2.5 pr-4 text-grey", "h2", "sm:h3")} aria-label={`Hey, ${user.displayName || "Anonymous coder"}`}>
                    Hey, {user.displayName || "anonymous coder"}
                  </h2>
                  <p className={clsx("text-grey-middle")}>You are learning to code accessibly.</p>
                </div>

                <div>
                  <div className="border-solid border-2 border-primary rounded-xl bg-primary px-6 py-4 text-center">
                    <h3 className={clsx("h5 font-normal", "md:mb-2", "lg:h5 lg:font-normal")} aria-label="Finished challenges: ">
                      finished challenges
                    </h3>
                    <p
                      className={clsx("font-mono", "h1 font-normal", "sm:text-7xl")}
                      aria-label={`${completedChallenges.length} of ${totalChallenges}`}
                    >
                      {completedChallenges.length}/{totalChallenges}
                    </p>
                  </div>

                  <p className="mt-2 pr-1 text-right">
                    {completedChallenges.length === totalChallenges ? "Yay, you're great!" : "Keep going, you can do it!"}
                  </p>
                </div>
              </div>

              {startedChallenges.length > 0 && (
                // {completedChallenges.length > 0 && (
                <section aria-labelledby="completedChallengeStats">
                  <ChallengeStatus id="completedChallengeStats" challenges={challenges} challengeStatus={ChallengeStatusData.Finished} />
                </section>
              )}

              {startedChallenges.length > 0 && (
                <section aria-labelledby="startedChallengeStats">
                  <ChallengeStatus id="startedChallengeStats" challenges={challenges} challengeStatus={ChallengeStatusData.InProgress} />
                </section>
              )}
              {openChallenges.length > 0 && (
                <section aria-labelledby="openChallengeStats">
                  <ChallengeStatus id="openChallengeStats" challenges={challenges} challengeStatus={ChallengeStatusData.Open} />
                </section>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host;
  const apolloClient = initializeApollo(getConfig(host).graphqlEndpointPath, null, context);

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
      config: getClientConfig(host),
    },
  };
};

export default Challenge;
