import { useApolloClient } from "@apollo/client";
import { getRouteList } from "app/components/breadcrumbs/getRouteList";
import { BreadcrumbInfo } from "app/components/breadcrumbs/routes";
import Slash from "app/components/icons/Slash";
import clsx from "clsx";
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
  }, [apolloClient, router, router.pathname]);

  return (
    <>
      {routeList.length > 1 && (
        <nav className={clsx("w-fit-content")} aria-label="Breadcrumbs">
          <ol className={clsx("flex flex-row")}>
            {routeList.map((route, idx) => {
              return (
                <li key={route.href} className={clsx("m-0")}>
                  <div className={clsx("flex items-center")}>
                    {idx > 0 && <Slash />}
                    <Link href={route.href}>
                      <a
                        className={clsx(
                          "ml-1 font-normal whitespace-nowrap",
                          "transition-colors duration-300",
                          "hover:text-primary-light hover:border-primary-light",
                          idx === routeList.length - 1 ? "text-light font-bold" : "text-grey-middle",
                          "focus:text-light",
                          "focus-rounded-instead-of-underline",
                        )}
                        aria-current={idx === routeList.length - 1 ? "page" : undefined}
                      >
                        {route.breadcrumb}
                      </a>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </>
  );
};

export default Breadcrumbs;
