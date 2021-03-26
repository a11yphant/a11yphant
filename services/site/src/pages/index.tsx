import Card from "app/components/Card";
import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Legend from "app/components/homepage/Legend";
import { HelloWorldDocument, useHelloWorldQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import React from "react";

const Home: React.FunctionComponent = () => {
  const { loading, data } = useHelloWorldQuery();

  return (
    <main className="flex flex-col h-19/20 box-border p-4">
      <ChallengeHeader className="mx-24" />
      <Legend className="mx-24" />
      <ChallengeList
        className="mx-24"
        heading={
          <>
            Easy
            <div className="w-3 h-5 border-2 rounded border-primary bg-primary ml-4" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
          </>
        }
        completedLevel={0}
        openLevel={1}
      />
      <Card heading={<h1>A11y Challenges</h1>}>
        <p>
          Welcome to a11y-challenges.cool! This is a project created by Michael Brandstätter, Thomas Dax, Daniela Kubesch and Luca Pircher during
          their MMT Master degree program at FH Salzburg
        </p>
        <p>{loading ? "Loading" : data?.helloWorld[0].message}</p>
      </Card>
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
