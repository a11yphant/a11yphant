import { ApolloClient, ApolloQueryResult, NormalizedCacheObject } from "@apollo/client";
import { CurrentUserDocument, CurrentUserQuery, CurrentUserQueryVariables } from "app/generated/graphql";

export const getServerSideCurrentUser = async (apolloClient: ApolloClient<NormalizedCacheObject>): Promise<ApolloQueryResult<CurrentUserQuery>> => {
  return apolloClient.query<CurrentUserQuery, CurrentUserQueryVariables>({
    query: CurrentUserDocument,
  });
};
