import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { CurrentUserDocument, CurrentUserQuery, CurrentUserQueryVariables } from "app/generated/graphql";

export const getServerSideCurrentUser = async (apolloClient: ApolloClient<NormalizedCacheObject>): Promise<void> => {
  await apolloClient.query<CurrentUserQuery, CurrentUserQueryVariables>({
    query: CurrentUserDocument,
  });
};
