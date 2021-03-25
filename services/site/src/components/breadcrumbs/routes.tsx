import { ApolloClient } from "@apollo/client";
import Home from "app/components/icons/Home";
import { ChallengeBySlugDocument, ChallengeBySlugQuery, ChallengeBySlugQueryVariables } from "app/generated/graphql";
import { ParsedUrlQuery } from "querystring";
import React from "react";

export interface Routes {
  [key: string]: RouteInfo;
}

export interface RouteInfo {
  getBreadcrumbInfo: (urlParams: ParsedUrlQuery, apolloClient?: ApolloClient<object>) => Promise<BreadcrumbInfo>;
}

export interface BreadcrumbInfo {
  href: string;
  breadcrumb: React.ReactNode;
}

export const useRoutes = (): Routes => {
  return routes;
};

const routes: Routes = {
  "/": {
    getBreadcrumbInfo: async () => {
      return {
        href: "/",
        breadcrumb: (
          <>
            <span className="sr-only">Home</span>
            <Home />
          </>
        ),
      };
    },
  },
  "/challenge/[challengeSlug]": {
    getBreadcrumbInfo: async (urlParams, apolloClient) => {
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
  "/challenge/[challengeSlug]/level/[nthLevel]": {
    getBreadcrumbInfo: async (urlParams) => {
      const { challengeSlug, nthLevel } = urlParams;

      return {
        href: `/challenge/${challengeSlug}/level/${nthLevel}`,
        breadcrumb: `Level ${nthLevel}`,
      };
    },
  },
};
