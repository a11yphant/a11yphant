import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Legend from "app/components/homepage/Legend";
import { ChallengesDocument, useChallengesQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

const Home: React.FunctionComponent = () => {
  const {
    data: { easyChallenges, mediumChallenges, hardChallenges },
  } = useChallengesQuery();

  return (
    <>
      <Head>
        <title>a11yphant</title>
      </Head>
      <main className="flex flex-col h-main box-border p-4">
        <section className="mx-24 my-20">
          <h2 className="font-bold font-ibmPlex text-5xl mb-6 max-w-2xl">Learning web accessibility made easy</h2>
          <p className="text-greyMiddle text-lg max-w-3xl">
            a11yphant teaches web accessibility, one step at a time, broken down into manageable pieces. We call these challenges. You won't need to
            read large amounts of text to complete those. Instead, you will learn by applying the concepts in code. Get started with your first web
            accessibility challenge and improve your skills.
          </p>
        </section>
        <ChallengeHeader className="mx-24" />
        <Legend className="mx-24" />
        <ChallengeList
          className="mx-24"
          heading={
            <>
              Easy
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-grey ml-4" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent ml-1" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent ml-1" />
            </>
          }
          completedLevel={0}
          openLevel={easyChallenges.length}
          challenges={easyChallenges}
        />

        <ChallengeList
          className="mx-24"
          heading={
            <>
              Medium
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-grey ml-4" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-grey ml-1" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent ml-1" />
            </>
          }
          completedLevel={0}
          openLevel={mediumChallenges.length}
          challenges={mediumChallenges}
        />

        <ChallengeList
          className="mx-24"
          heading={
            <>
              Hard
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-grey ml-4" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-grey ml-1" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-grey ml-1" />
            </>
          }
          completedLevel={0}
          openLevel={hardChallenges.length}
          challenges={hardChallenges}
        />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ChallengesDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displayBreadcrumbs: false,
    },
  };
};

export default Home;
