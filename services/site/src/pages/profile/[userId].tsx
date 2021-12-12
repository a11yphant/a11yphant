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
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

// Workaround due too ts-jests issues with enums: https://github.com/kulshekhar/ts-jest/issues/1357#issuecomment-580736356
const ChallengeStatus = { ...ChallengeStatusEnum };

function challengeStatusToText(status: ChallengeStatusEnum): string {
  if (status === ChallengeStatus.Open) {
    return "Not started";
  } else if (status === ChallengeStatus.InProgress) {
    return "In progress";
  } else if (status === ChallengeStatus.Finished) {
    return "Done";
  }
}

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

  return (
    <>
      <Head>
        <title>{user.displayName || "Anonymous user"}'s profile | a11yphant</title>
        <meta name="description" content="Create a user profile on a11yphant by signing up with Twitter, GitHub or simply with your e-mail." />
        <meta property="og:title" content={`${user.displayName || "Anonymous user"}'s profile`} />
        <meta property="og:description" content="Create a user profile on a11yphant by signing up with Twitter, GitHub or simply with your e-mail." />
        <meta property="og:image" content="/images/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        <meta property="og:locale" content="de" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.a11yphant.com/${user.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("max-w-screen-xl mx-8 mt-32 mb-24", "sm:mx-12 sm:mt-28 sm:mb-12", "md:mx-24", "2xl:mx-auto")}>
        <h1 className={clsx("pb-24 text-grey", "h3", "sm:h2")}>{user.displayName || "Anonymous users"}'s profile</h1>
        <table>
          <thead className={clsx("text-left", "h5")}>
            <tr>
              <th>Challenge</th>
              <th className={clsx("pl-4")}>Status</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((challenge) => (
              <tr key={challenge.id}>
                <td>{challenge.name}</td>
                <td className={clsx("pl-4")}>{challengeStatusToText(challenge.statusForUser)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

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
    },
  };
};

export default Challenge;
