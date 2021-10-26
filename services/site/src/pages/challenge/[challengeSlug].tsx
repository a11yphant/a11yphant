import { initializeApollo } from "app/lib/apollo-client";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

const Challenge: React.FunctionComponent = () => {
  const router = useRouter();

  // @TODO: Replace with challenge modal
  React.useEffect(() => {
    router.push(`${router.asPath}/level/01`);
  }, []);

  return <div />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  await Promise.all([getServerSideCurrentUser(apolloClient)]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displayBreadcrumbs: false,
      showScrollOverlay: false,
    },
  };
};

export default Challenge;
