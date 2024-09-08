import Footer from "app/components/Footer";
import Check from "app/components/icons/Check";
import IllustrationRocket from "app/components/icons/IllustrationRocket";
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
import Link from "next/link";
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
      <main className={clsx("bg-texture h-full box-border max-w-screen-3xl mx-auto mt-32")}>
        <div className={clsx("mx-8 h-main max-w-screen-3xl mt-12", "sm:mx-12 sm:mt-24", "lg:mx-24")}>
          <div className={clsx("flex flex-col justify-between content-start pb-6 mb-20 border-grey-light border-b", "md:flex-row md:content-end")}>
            <div className={clsx("self-center")}>
              <h1 className={clsx("pb-2.5 pr-4 text-grey", "h2", "sm:h1 sm:leading-[1.1]")}>
                Your <br></br> accessibility <br></br> journey
              </h1>
            </div>

            <IllustrationRocket className={clsx("h-auto")} />
          </div>
          <section
            className={clsx("flex flex-col my-6 py-12 px-4 sm:px-6 lg:p-12 container-dark", "sm:my-8", "xl:my-10")}
            aria-labelledby="profileStats"
          >
            <div className={clsx("flex justify-between")}>
              <div>
                <h2 id="profileStats" className={clsx("pb-2.5 pr-4 text-grey", "h2", "sm:h3")}>
                  Hey, {user.displayName || "Anonymous coder"}
                </h2>
                <p className={clsx("text-grey-middle")}>You are learning to code accessibly.</p>
              </div>

              <div>
                <div className="border-solid border-2 border-primary rounded-xl bg-primary px-6 py-4 text-center">
                  <h3 className={clsx("h5 font-normal", "md:mb-2", "lg:h5 lg:font-normal")}>finished challenges</h3>
                  <p className={clsx("font-mono", "h1 font-normal", "sm:text-7xl")}>
                    {completedChallenges.length}/{totalChallenges} <span className="sr-only">challenges</span>
                  </p>
                </div>

                <p className="mt-2 pr-1 text-right">
                  {completedChallenges.length === totalChallenges ? "Yay, you're great!" : "Keep going, you can do it!"}
                </p>
              </div>
            </div>

            {/* {completedChallenges.length > 0 && ( */}
            <div>
              <h3 className={clsx("mb-2.5", "h5 font-medium", "sm:h4 sm:font-medium")}>Completed</h3>
              <ul className="gap-4 pt-2 mb-10 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {challenges.map(
                  (challenge) =>
                    // {/*  TODO: change to finished */}
                    challenge.statusForUser === ChallengeStatus.Open && (
                      <li key={challenge.id} className={clsx("m-0 p-0")}>
                        <Link
                          href={`/challenges`}
                          className={clsx(
                            "relative block border border-solid rounded-lg px-4 py-3 w-full h-18",
                            "group hover:bg-primary-dark hover:border-primary-dark",
                            "border-primary bg-primary",
                          )}
                        >
                          <span className={clsx("font-normal mb-0 block", "text-white")}>{challenge.name}</span>
                          {/*  TODO: change to finished */}
                          {challenge.statusForUser === ChallengeStatus.Open && (
                            <>
                              <Check className="h-4 w-10 absolute top-4 right-5 text-grey-light" />
                            </>
                          )}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
            {/* )} */}

            {startedChallenges.length > 0 && (
              <div>
                <h3 className={clsx("mb-2.5", "h5 font-medium", "sm:h4 sm:font-medium")}>Currently coding</h3>
                <ul className="gap-4 pt-2 mb-10 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {challenges.map(
                    (challenge) =>
                      challenge.statusForUser === ChallengeStatus.InProgress && (
                        <li key={challenge.id} className={clsx("m-0 p-0")}>
                          <Link
                            href={`/challenges`}
                            className={clsx(
                              "relative block border border-solid rounded-lg w-full h-18",
                              "group hover:bg-primary-dark hover:border-primary-dark",
                              "border-grey-light",
                            )}
                          >
                            <span
                              className={clsx(
                                "font-normal mb-0 block px-4 py-3",
                                "text-grey-light group-hover:text-white motion-safe:transition-colors transition-300",
                              )}
                            >
                              {challenge.name}
                            </span>
                            <div className="w-full h-fit-content bg-primary-dark border-t border-solid rounded-bl-lg rounded-br-lg border-grey-light">
                              <span
                                className={clsx(
                                  "font-normal text-sm text-right py-1 px-2 block",
                                  "text-grey-light group-hover:text-white motion-safe:transition-colors transition-300",
                                )}
                              >
                                24% completed
                              </span>
                            </div>
                          </Link>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            )}
            {openChallenges.length > 0 && (
              <div>
                <h3 className={clsx("mb-2.5", "h5 font-medium", "sm:h4 sm:font-medium")}>Not started yet</h3>
                <ul className="gap-4 pt-2 mb-10 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {challenges.map(
                    (challenge) =>
                      challenge.statusForUser === ChallengeStatus.Open && (
                        <li key={challenge.id} className={clsx("m-0 p-0")}>
                          <Link
                            href={`/challenges`}
                            className={clsx(
                              "relative block border border-solid rounded-lg w-full h-18",
                              "group hover:bg-primary-dark hover:border-primary-dark",
                              "border-grey-dark",
                            )}
                          >
                            <span
                              className={clsx(
                                "font-normal px-4 py-3 block",
                                "text-grey-middle group-hover:text-white motion-safe:transition-colors transition-300",
                              )}
                            >
                              {challenge.name}
                            </span>
                            <div className="w-full h-fit-content  border-t border-solid rounded-bl-lg rounded-br-lg border-grey-dark">
                              <span
                                className={clsx(
                                  "font-normal text-sm text-right py-1 px-2 block",
                                  "text-grey-middle group-hover:text-white motion-safe:transition-colors transition-300",
                                )}
                              >
                                0% completed
                              </span>
                            </div>
                          </Link>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            )}
          </section>
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
