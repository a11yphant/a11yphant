import { useApolloClient } from "@apollo/client";
import { getRouteList } from "app/components/breadcrumbs/getRouteList";
import { BreadcrumbInfo } from "app/components/breadcrumbs/routes";
import Slash from "app/components/icons/Slash";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Breadcrumbs: React.FunctionComponent = () => {
  const router = useRouter();
  const apolloClient = useApolloClient();

  const [routeList, setRouteList] = React.useState<BreadcrumbInfo[]>([]);

  React.useEffect(() => {
    // Workaround for `Warning: Can't perform a React state update on an unmounted component.`
    // as seen here: https://stackoverflow.com/a/60907638
    let isMounted = true;

    getRouteList(router, apolloClient).then((routeList) => {
      if (isMounted) {
        setRouteList(routeList);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router.pathname]);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {routeList.map((route, idx) => {
          return (
            <li key={route.href}>
              <div className="flex items-center">
                {idx > 0 && <Slash />}
                <Link href={route.href}>
                  <a className={`${idx === routeList.length - 1 && "text-primary"} ml-1 text-gray-500 hover:text-primaryDark`}>{route.breadcrumb}</a>
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
