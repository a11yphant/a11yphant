import { UserAccountBox } from "app/components/auth/UserAccountBox";
import { initializeApollo } from "app/lib/apollo-client";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import { GetServerSideProps } from "next";
import React from "react";

const AuthBoxPage: React.FunctionComponent = () => {
  return <UserAccountBox mode={"login"} />;
};

export default AuthBoxPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  await Promise.all([getServerSideCurrentUser(apolloClient)]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
