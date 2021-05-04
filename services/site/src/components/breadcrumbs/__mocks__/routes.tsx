import { ApolloClient } from "@apollo/client";
import { ChallengeBySlugDocument, ChallengeBySlugQuery, ChallengeBySlugQueryVariables } from "app/generated/graphql";

export const routes = {
  "/": {
    getBreadcrumbInfo: async () => {
      return {
        href: "/",
        breadcrumb: "Challenges",
      };
    },
  },
  "/challenge/[challengeSlug]": {
    getBreadcrumbInfo: async (urlParams, apolloClient: ApolloClient<object>) => {
      const { challengeSlug } = urlParams;

      const { data } = await apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
        query: ChallengeBySlugDocument,
        variables: { slug: challengeSlug as string },
      });

      return {
        href: `/challenge/${challengeSlug}`,
        breadcrumb: data.challenge?.name,
      };
    },
  },
};
