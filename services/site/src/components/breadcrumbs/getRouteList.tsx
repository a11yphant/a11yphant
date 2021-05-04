import { ApolloClient } from "@apollo/client";
import { BreadcrumbInfo, routes } from "app/components/breadcrumbs/routes";
import { NextRouter } from "next/router";

export const getRouteList = async (router: NextRouter, apolloClient: ApolloClient<object>): Promise<BreadcrumbInfo[]> => {
  const urlParams = router.query;
  const pathnameArr = router.pathname === "/" ? [""] : router.pathname.split("/");

  const breadcrumbInfoList: BreadcrumbInfo[] = [];

  for (let i = 0; i < pathnameArr.length; i++) {
    const pathname = pathnameArr.slice(0, i + 1).join("/") || "/";

    if (routes[pathname]) {
      const breadcrumbInfo = await routes[pathname].getBreadcrumbInfo(urlParams, apolloClient);
      breadcrumbInfoList.push(breadcrumbInfo);
    }
  }

  return breadcrumbInfoList;
};
