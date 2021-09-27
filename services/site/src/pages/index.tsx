import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Hero from "app/components/homepage/Hero";
import Legend from "app/components/homepage/Legend";
import Navigation from "app/components/Navigation";
import { ChallengesDocument, CurrentUserDocument, useChallengesQuery, useCurrentUserQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

const Home: React.FunctionComponent = () => {
  const {
    data: { easyChallenges, mediumChallenges, hardChallenges },
  } = useChallengesQuery();

  const {
    data: { currentUser },
  } = useCurrentUserQuery();

  return (
    <>
      <Head>
        <title>a11yphant</title>
      </Head>
      <Navigation displayBreadcrumbs />
      <main className={clsx("h-main flex flex-col box-border")}>
        <div className={clsx("w-full h-full")}>
          {!currentUser?.isRegistered && <Hero />}
          <section id="challenges" className={clsx("max-w-screen-3xl mx-8 mt-32 mb-24", "sm:mx-12 sm:mt-28 sm:mb-12", "md:mx-24", "2xl:mx-auto")}>
            <ChallengeHeader className={clsx("2xl:mx-24")} />
            <Legend className={clsx("2xl:mx-24")} />
            {easyChallenges.length !== 0 && (
              <ChallengeList
                className={clsx("2xl:mx-24")}
                heading={
                  <>
                    Easy
                    <div className={clsx("ml-4 w-2.5 h-5 border-2 rounded-sm border-grey bg-grey")} />
                    <div className={clsx("ml-1 w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent")} />
                    <div className={clsx("ml-1 w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent")} />
                  </>
                }
                completedLevel={0}
                openLevel={easyChallenges.length}
                challenges={easyChallenges}
              />
            )}

            {mediumChallenges.length !== 0 && (
              <ChallengeList
                className={clsx("2xl:mx-24")}
                heading={
                  <>
                    Medium
                    <div className={clsx("ml-4 w-2.5 h-5 border-2 rounded-sm border-grey bg-grey")} />
                    <div className={clsx("ml-1 w-2.5 h-5 border-2 rounded-sm border-grey bg-grey")} />
                    <div className={clsx("ml-1 w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent")} />
                  </>
                }
                completedLevel={0}
                openLevel={mediumChallenges.length}
                challenges={mediumChallenges}
              />
            )}

            {hardChallenges.length !== 0 && (
              <ChallengeList
                className={clsx("2xl:mx-24")}
                heading={
                  <>
                    Hard
                    <div className={clsx("ml-4 w-2.5 h-5 border-2 rounded-sm border-grey bg-grey")} />
                    <div className={clsx("ml-1 w-2.5 h-5 border-2 rounded-sm border-grey bg-grey")} />
                    <div className={clsx("ml-1 w-2.5 h-5 border-2 rounded-sm border-grey bg-grey")} />
                  </>
                }
                completedLevel={0}
                openLevel={hardChallenges.length}
                challenges={hardChallenges}
              />
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  await Promise.all([
    apolloClient.query({
      query: ChallengesDocument,
    }),
    apolloClient.query({
      query: CurrentUserDocument,
    }),
  ]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default Home;
