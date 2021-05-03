import Card from "app/components/homepage/Card";
import { DifficultyLevel } from "app/components/homepage/Card";
import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Legend from "app/components/homepage/Legend";
import { HelloWorldDocument } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import React from "react";

const Home: React.FunctionComponent = () => {
  return (
    <main className="flex flex-col h-19/20 box-border p-4">
      <ChallengeHeader className="mx-24" />
      <Legend className="mx-24" />
      <ChallengeList
        className="mx-28"
        heading={
          <>
            Easy
            <div className="w-3 h-5 border-2 rounded border-primary bg-primary ml-4" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
          </>
        }
        completedLevel={0}
        openLevel={2}
      />
      <div className="flex mx-24">
        <Card className="mr-24" heading="HTML Basics" levels={12} difficulty={DifficultyLevel.easy} />
        <Card className="mr-24" heading="Semantic HTML" levels={8} difficulty={DifficultyLevel.hard} />
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: HelloWorldDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displayBreadcrumbs: false,
    },
  };
};

export default Home;
