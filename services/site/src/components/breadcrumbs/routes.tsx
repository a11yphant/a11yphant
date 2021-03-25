import { ApolloClient } from "@apollo/client";
import Home from "app/components/icons/Home";
import { BreadcrumbChallengeDocument, BreadcrumbChallengeQuery, BreadcrumbChallengeQueryVariables } from "app/generated/graphql";
import { ParsedUrlQuery } from "querystring";
import React from "react";

interface Routes {
  [key: string]: (urlParams: ParsedUrlQuery, apolloClient?: ApolloClient<object>) => Promise<RouteInfo>;
}

export interface RouteInfo {
  href: string;
  breadcrumb: React.ReactNode;
}

export const useRoutes = (): Routes => {
  return routes;
};

const routes: Routes = {
  "/": async () => {
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
  "/challenge/[challengeSlug]": async (urlParams, apolloClient) => {
    const { challengeSlug } = urlParams;

    const { data } = await apolloClient.query<BreadcrumbChallengeQuery, BreadcrumbChallengeQueryVariables>({
      query: BreadcrumbChallengeDocument,
      variables: { slug: challengeSlug as string },
    });

    return {
      href: `/challenge/${challengeSlug}`,
      breadcrumb: data.challenge?.name,
    };
  },
  "/challenge/[challengeSlug]/level/[nthLevel]": async (urlParams) => {
    const { challengeSlug, nthLevel } = urlParams;

    return {
      href: `/challenge/${challengeSlug}/level/${nthLevel}`,
      breadcrumb: `Level ${nthLevel}`,
    };
  },
};
