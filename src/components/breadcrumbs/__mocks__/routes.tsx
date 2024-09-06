import { ApolloClient } from "@apollo/client";
import { Routes } from "app/components/breadcrumbs/routes";
import { ChallengeBySlugDocument, ChallengeBySlugQuery, ChallengeBySlugQueryVariables } from "app/generated/graphql";

export const routes: Routes = {
  "/": {
    getBreadcrumbInfo: async () => {
      return {
        href: "/",
        breadcrumb: "Mock Home",
      };
    },
  },
  "/challenges/[challengeSlug]": {
    getBreadcrumbInfo: async (urlParams, apolloClient: ApolloClient<object>) => {
      const { challengeSlug } = urlParams;

      const { data } = await apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
        query: ChallengeBySlugDocument,
        variables: { slug: challengeSlug as string },
      });

      return {
        href: `/challenges/${challengeSlug}`,
        breadcrumb: data.challenge?.name,
      };
    },
  },
};
