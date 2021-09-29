import { initializeApollo } from "app/lib/apollo-client";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

const challengeSlug = "accessible-links";
const nthLevel = "01";

const Challenge: React.FunctionComponent = () => {
  const router = useRouter();

  // @TODO: Remove once /challenges exists
  React.useEffect(() => {
    router.push(`challenge/${challengeSlug}/level/${nthLevel}`);
  }, []);

  return <div />;
};

export default Challenge;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  await Promise.all([getServerSideCurrentUser(apolloClient)]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
