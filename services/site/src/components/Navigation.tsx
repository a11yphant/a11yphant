import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Button from "./buttons/Button";
import Dropdown from "./common/dropdown/Dropdown";
import UserAvatar from "./icons/UserAvatar";

export interface NavigationProps {
  displayBreadcrumbs?: boolean;
  displaySave?: boolean;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ displayBreadcrumbs = true, children }) => {
  const { currentUser } = useCurrentUser();
  const userAccountModalApi = useUserAccountModalApi();

  return (
    <header className={clsx("pt-8 pb-6 px-11 grid grid-cols-2 relative z-10", "lg:grid-cols-3")}>
      <Link href="/">
        <a
          className={clsx(
            "block text-light border-none col-span-1 max-w-max",
            "transition ease-in-out duration-300",
            "motion-safe:hover:scale-110 motion-reduce:border-solid",
          )}
        >
          <A11yphantLogo className="w-36" />
          <span className="sr-only">Allyphant Homepage</span>
        </a>
      </Link>
      {displayBreadcrumbs && (
        <div className={clsx("ml-[50%] -translate-x-1/2 col-span-1 w-fit-content hidden self-center", "lg:block")}>
          <Breadcrumbs />
        </div>
      )}
      <div className={clsx("hidden justify-end items-center", "sm:flex")}>
        {children}
        {currentUser?.isRegistered && (
          <Dropdown
            triggerButton={
              <Dropdown.TriggerButton>
                <span className={clsx("sr-only")}>User Menu</span>
                <UserAvatar />
              </Dropdown.TriggerButton>
            }
          >
            <Dropdown.Group>
              <Dropdown.Link href={`/profile/${currentUser?.id}`}>Public Profile</Dropdown.Link>
            </Dropdown.Group>
          </Dropdown>
        )}
        {!currentUser?.isRegistered && (
          <>
            <Button
              primary
              onClick={() => {
                userAccountModalApi.show("signup");
              }}
              className="mx-4 px-6"
            >
              Sign Up
            </Button>{" "}
            <Button
              onClick={() => {
                userAccountModalApi.show("login");
              }}
              className="px-6"
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
