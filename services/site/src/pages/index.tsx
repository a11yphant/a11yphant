import Card from "app/components/Card";
import { HelloWorldDocument, useHelloWorldQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import React from "react";

const Home: React.FunctionComponent = () => {
  const {
    loading,
    data: {
      helloWorld: [{ message }],
    },
  } = useHelloWorldQuery();
  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <Card heading={<h1>A11y Challenges</h1>}>
        <p>
          Welcome to a11y-challenges.cool! This is a project created by Michael Brandstätter, Thomas Dax, Daniela Kubesch and Luca Pircher during
          their MMT Master degree program at FH Salzburg
        </p>
        <p>{loading ? "Loading" : message}</p>
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
    },
  };
};

export default Home;
