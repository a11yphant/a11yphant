import { ApolloClient } from "@apollo/client";
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

export const routes: Routes = {
  "/": {
    getBreadcrumbInfo: async () => {
      return {
        href: "/",
        breadcrumb: "Challenges",
      };
    },
  },
  "/challenge/[challengeSlug]": {
    getBreadcrumbInfo: async (urlParams: { challengeSlug: string }, apolloClient) => {
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
    getBreadcrumbInfo: async (urlParams: { challengeSlug: string; nthLevel: string }) => {
      const { challengeSlug, nthLevel } = urlParams;

      return {
        href: `/challenge/${challengeSlug}/level/${nthLevel}`,
        breadcrumb: `Level ${Number(nthLevel).toLocaleString("de-AT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`,
      };
    },
  },
  "/challenge/[challengeSlug]/level/[nthLevel]/evaluation": {
    getBreadcrumbInfo: async (urlParams: { challengeSlug: string; nthLevel: string }) => {
      const { challengeSlug, nthLevel } = urlParams;

      return {
        href: `/challenge/${challengeSlug}/level/${nthLevel}/evaluation`,
        breadcrumb: "Evaluation",
      };
    },
  },
};
