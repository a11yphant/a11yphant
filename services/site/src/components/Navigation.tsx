import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Button from "./buttons/Button";
import UserAvatar from "./icons/UserAvatar";

interface NavigationProps {
  displayBreadcrumbs?: boolean;
  displaySave?: boolean;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ displayBreadcrumbs = true, children }) => {
  // TODO: replace when login is implemented
  const displayUserProfile = false;
  const displayRegistration = false;

  return (
    <header className="h-[8%] pt-8 pb-6 px-11 grid grid-cols-4">
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
        {displayUserProfile && <UserAvatar className="ml-4" />}
        {displayRegistration && (
          <>
            <Button primary className="mx-4">
              Sign Up
            </Button>{" "}
            <Button>Login</Button>
          </>
        )}
      </div>
    </header>
  );
};
export default Navigation;
