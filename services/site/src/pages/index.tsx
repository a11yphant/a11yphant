import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Legend from "app/components/homepage/Legend";
import { ChallengesDocument, useChallengesQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import React from "react";

const Home: React.FunctionComponent = () => {
  const {
    data: { easyChallenges, mediumChallenges, hardChallenges },
  } = useChallengesQuery();

  return (
    <main className="flex flex-col h-19/20 box-border p-4">
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
