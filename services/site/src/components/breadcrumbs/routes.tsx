import { ApolloClient } from "@apollo/client";
import { ChallengeBySlugDocument, ChallengeBySlugQuery, ChallengeBySlugQueryVariables } from "app/generated/graphql";
import React from "react";

export interface Routes {
  [key: string]: RouteInfo;
}

type GetBreadcrumbInfoFunction = (urlParams: Record<string, string | string[] | null>, apolloClient: ApolloClient<object>) => Promise<BreadcrumbInfo>;

export interface RouteInfo {
  getBreadcrumbInfo: GetBreadcrumbInfoFunction;
}

type Route = {
  pattern: RegExp;
  getBreadcrumbInfo: GetBreadcrumbInfoFunction;
};

export interface BreadcrumbInfo {
  href: string;
  breadcrumb: React.ReactNode;
}

export function match(key: string): RouteInfo | null {
  const routes = [landingpage, challengeDetails, level, evaluation];

  for (const { pattern, getBreadcrumbInfo } of routes) {
    if (key.match(pattern) === null) {
      continue;
    }

    return { getBreadcrumbInfo };
  }

  return null;
}

const landingpage: Route = {
  pattern: /^\/$/,
  getBreadcrumbInfo: async () => {
    return Promise.resolve({
      href: "/",
      breadcrumb: "Challenges",
    });
  },
};

const challengeDetails: Route = {
  pattern: /^\/challenge\/[\w-]+$/,
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

const level: Route = {
  pattern: /^\/challenge\/[\w-]+\/level\/[\w-]+$/,
  getBreadcrumbInfo: async (urlParams: { challengeSlug: string; nthLevel: string }) => {
    const { challengeSlug, nthLevel } = urlParams;

    return Promise.resolve({
      href: `/challenge/${challengeSlug}/level/${nthLevel}`,
      breadcrumb: `Level ${String(nthLevel).padStart(2, "0")}`,
    });
  },
};

const evaluation: Route = {
  pattern: /^\/challenge\/[\w-]+\/level\/[\w-]+\/evaluation$/,
  getBreadcrumbInfo: async (urlParams: { challengeSlug: string; nthLevel: string }) => {
    const { challengeSlug, nthLevel } = urlParams;

    return Promise.resolve({
      href: `/challenge/${challengeSlug}/level/${nthLevel}/evaluation`,
      breadcrumb: "Evaluation",
    });
  },
};
