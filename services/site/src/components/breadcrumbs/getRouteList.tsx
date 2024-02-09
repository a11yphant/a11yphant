import { ApolloClient } from "@apollo/client";
import { BreadcrumbInfo, match } from "app/components/breadcrumbs/routes";

export const getRouteList = async (
  pathname: string,
  urlParams: Record<string, string | string[] | null>,
  apolloClient: ApolloClient<object>,
): Promise<BreadcrumbInfo[]> => {
  const pathnameArr = pathname === "/" ? [""] : pathname.split("/");

  const breadcrumbInfoList: BreadcrumbInfo[] = [];

  for (let i = 0; i < pathnameArr.length; i++) {
    const pathname = pathnameArr.slice(0, i + 1).join("/") || "/";
    const route = match(pathname);

    if (route) {
      const breadcrumbInfo = await route.getBreadcrumbInfo(urlParams, apolloClient);
      breadcrumbInfoList.push(breadcrumbInfo);
    }
  }

  return breadcrumbInfoList;
};
