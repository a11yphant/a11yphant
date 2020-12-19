import Card from "app/components/Card";
import { HelloWorldDocument, useHelloWorldQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import React from "react";

const Home = () => {
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

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: HelloWorldDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
}

export default Home;
