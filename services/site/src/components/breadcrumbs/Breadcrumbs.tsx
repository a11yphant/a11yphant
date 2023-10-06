import { useApolloClient } from "@apollo/client";
import { getRouteList } from "app/components/breadcrumbs/getRouteList";
import { BreadcrumbInfo } from "app/components/breadcrumbs/routes";
import Slash from "app/components/icons/Slash";
import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";

const Breadcrumbs: React.FunctionComponent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const apolloClient = useApolloClient();

  const [routeList, setRouteList] = React.useState<BreadcrumbInfo[]>([]);

  React.useEffect(() => {
    // Workaround for `Warning: Can't perform a React state update on an unmounted component.`
    // as seen here: https://stackoverflow.com/a/60907638
    let isMounted = true;
    getRouteList(pathname || "", { ...params, ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}) }, apolloClient).then(
      (routeList) => {
        if (isMounted) {
          setRouteList(routeList);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, [apolloClient, searchParams, pathname, params]);

  return (
    <>
      {routeList.length > 1 && (
        <nav className={clsx("w-fit-content")} aria-label="Breadcrumbs">
          <ol className={clsx("flex flex-wrap lg:flex-nowrap")}>
            {routeList.map((route, idx) => {
              return (
                <li key={route.href} className={clsx("m-0")}>
                  <div className={clsx("flex items-center")}>
                    {idx > 0 && <Slash />}
                    <Link
                      href={route.href}
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
