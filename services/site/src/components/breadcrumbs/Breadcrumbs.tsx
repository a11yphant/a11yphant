import { useApolloClient } from "@apollo/client";
import { RouteInfo, useRoutes } from "app/components/breadcrumbs/routes";
import Slash from "app/components/icons/Slash";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Breadcrumbs: React.FunctionComponent = () => {
  const router = useRouter();
  const routes = useRoutes();
  const apolloClient = useApolloClient();

  const [routeList, setRouteList] = React.useState<RouteInfo[]>([]);

  const getRouteList = async (): Promise<RouteInfo[]> => {
    const urlParams = router.query;
    const pathname = router.pathname;
    const pathnameArr = pathname.split("/");

    return pathnameArr.reduce<Promise<RouteInfo[]>>(async (routeInfoList, pathSegment, idx) => {
      const pathname = pathnameArr.slice(0, idx + 1).join("/") || "/";

      if (routes[pathname]) {
        const routeInfo = await routes[pathname](urlParams, apolloClient);
        const existingRouteInfoList = await routeInfoList;
        return [...existingRouteInfoList, routeInfo];
      }

      return routeInfoList;
    }, Promise.resolve([]));
  };

  React.useEffect(() => {
    const asyncGetRouteList = async (): Promise<void> => {
      const routeList = await getRouteList();
      setRouteList(routeList);
    };

    asyncGetRouteList();
  }, []);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {routeList.map((route, idx) => {
          return (
            <li key={route.href}>
              <div className="flex items-center">
                {idx > 0 && <Slash />}
                <Link href={route.href}>
                  <a className="ml-1 text-gray-500 hover:text-primaryDark">{route.breadcrumb}</a>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
