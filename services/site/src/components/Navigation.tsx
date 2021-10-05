import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Button from "./buttons/Button";
import UserAvatar from "./icons/UserAvatar";

export interface NavigationProps {
  displayBreadcrumbs?: boolean;
  displaySave?: boolean;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ displayBreadcrumbs = true, children }) => {
  const { currentUser } = useCurrentUser();
  const userAccountModalApi = useUserAccountModalApi();

  return (
    <header className="h-[8%] pt-8 pb-6 px-11 grid grid-cols-4 relative z-10">
      <h1>
        <Link href="/">
          <a
            className={clsx(
              "block text-light border-none col-span-1 max-w-max",
              "transform transition ease-in-out duration-300",
              "motion-safe:hover:scale-110 motion-reduce:border-solid",
            )}
          >
            <A11yphantLogo className="w-36" />
            <span className="sr-only">Allyphant Homepage</span>
          </a>
        </Link>
      </h1>
      {displayBreadcrumbs && (
        <>
          <div className={clsx("justify-center items-center col-span-2 hidden", "lg:flex")}>
            <Breadcrumbs />
          </div>
        </>
      )}
      <div className="flex justify-end items-center col-span-1">
        {children}
        {currentUser?.isRegistered && <UserAvatar className="ml-4" />}
        {!currentUser?.isRegistered && (
          <>
            <Button
              primary
              onClick={() => {
                userAccountModalApi.show("signup");
              }}
              className="mx-4"
            >
              Sign Up
            </Button>{" "}
            <Button
              onClick={() => {
                userAccountModalApi.show("login");
              }}
            >
              Login
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navigation;
