import { ApolloClient } from "@apollo/client";
import { ChallengeBySlugDocument, ChallengeBySlugQuery, ChallengeBySlugQueryVariables } from "app/generated/graphql";
import React from "react";

export interface Routes {
  [key: string]: RouteInfo;
}

export interface RouteInfo {
  getBreadcrumbInfo: (urlParams: Record<string, string | string[] | null>, apolloClient: ApolloClient<object>) => Promise<BreadcrumbInfo>;
}

export interface BreadcrumbInfo {
  href: string;
  breadcrumb: React.ReactNode;
}

export function match(key: string): RouteInfo | null {
  if (key === "/") {
    return {
      getBreadcrumbInfo: async () => {
        return {
          href: "/",
          breadcrumb: "Challenges",
        };
      },
    };
  } else if (key.match(/^\/challenge\/[\w-]+$/) !== null) {
    return {
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
    };
  } else if (key.match(/^\/challenge\/[\w-]+\/level\/[\w-]+$/) !== null) {
    return {
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
    };
  } else if (key.match(/^\/challenge\/[\w-]+\/level\/[\w-]+\/evaluation$/) !== null) {
    return {
      getBreadcrumbInfo: async (urlParams: { challengeSlug: string; nthLevel: string }) => {
        const { challengeSlug, nthLevel } = urlParams;

        return {
          href: `/challenge/${challengeSlug}/level/${nthLevel}/evaluation`,
          breadcrumb: "Evaluation",
        };
      },
    };
  }

  return null;
}
