import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { CurrentUserDocument, useLogoutMutation } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Button from "./buttons/Button";
import Dropdown from "./common/dropdown/Dropdown";
import A11yphantLogo from "./icons/A11yphantLogo";
import UserAvatar from "./icons/UserAvatar";
import X from "./icons/X";

export interface NavigationProps {
  displayBreadcrumbs?: boolean;
  displaySave?: boolean;
  isSticky?: boolean;
}

const Navigation: React.FC<React.PropsWithChildren<NavigationProps>> = ({ displayBreadcrumbs = true, isSticky = true, children }) => {
  const { currentUser } = useCurrentUser();
  const [logout] = useLogoutMutation({
    refetchQueries: [{ query: CurrentUserDocument }],
  });
  const userAccountModalApi = useUserAccountModalApi();

  return (
    <>
      <header
        className={clsx(
          "pt-2 pb-4 px-6 sm:px-8 grid grid-cols-12 z-20 bg-background",
          "sm:px-11",
          "md:pt-4",
          "lg:py-6",
          isSticky && "fixed top-0 w-full",
          !isSticky && "relative",
        )}
      >
        <Link
          href="/"
          className={clsx(
            "block text-light border-none rounded col-span-10 max-w-max py-1 px-2 -ml-2",
            "transition ease-in-out duration-300",
            "motion-safe:hover:scale-110 motion-reduce:border-solid",
            "focus-outline-offset",
            "lg:col-span-2",
          )}
        >
          <A11yphantLogo className="w-48 xs:w-52 sm:w-36" />
          <span className="sr-only">Allyphant Homepage</span>
        </Link>
        {displayBreadcrumbs && (
          <div className={clsx("mt-4 col-span-12 w-fit-content self-center", "lg:mt-0 lg:col-span-6")}>
            <Breadcrumbs />
          </div>
        )}
        <div className={clsx("flex justify-end items-center col-span-12", "lg:col-span-4")}>
          {children}
          <nav className={clsx("justify-end items-center", "sm:flex")} aria-label="Main">
            <Link
              href="/challennges"
              className={clsx(
                "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                "transition-colors duration-300",
                "hover:text-primary-light hover:decoration-primary-light",
                "focus-rounded-instead-of-underline",
                "hidden md:block",
              )}
            >
              Challenges
            </Link>
            {!currentUser?.isRegistered && (
              <>
                <Button
                  onClick={() => {
                    userAccountModalApi.show("login");
                  }}
                  className={clsx("py-3 border-none", "hover:border-primary-dark", "focus:bg-transparent", "hidden md:block")}
                >
                  Login
                </Button>
                <Button
                  primary
                  onClick={() => {
                    userAccountModalApi.show("signup");
                  }}
                  className={clsx("ml-2 xl:ml-4", "hidden md:block")}
                >
                  Sign Up
                </Button>{" "}
              </>
            )}
            {currentUser?.isRegistered && (
              <Dropdown
                triggerButton={
                  <Dropdown.TriggerButton
                    className={clsx(
                      "hover:text-primary-light motion-safe:transition-colors transition-300 align-middle rounded",
                      "focus:outline-offset-2",
                    )}
                  >
                    <span className={clsx("sr-only")}>User Menu</span>
                    <UserAvatar />
                  </Dropdown.TriggerButton>
                }
              >
                <Dropdown.Group>
                  <Dropdown.Link href={`/profile/${currentUser?.id}`}>Public Profile</Dropdown.Link>
                </Dropdown.Group>
                <Dropdown.Group>
                  <Dropdown.Button onClick={() => logout()}>Logout</Dropdown.Button>
                </Dropdown.Group>
              </Dropdown>
            )}
            {/* Mobile Nav */}
            <Dropdown
              hamburger={true}
              isSticky={isSticky}
              triggerButton={
                <Dropdown.TriggerButton
                  className={clsx(
                    "flex flex-row items-center pl-4",
                    "hover:text-primary-light motion-safe:transition-colors transition-300 align-middle",
                    "focus:outline-offset-2",
                  )}
                >
                  <span className={clsx("")}>Menu</span>
                  <X className={clsx("w-4 h-4 ml-2")} />
                </Dropdown.TriggerButton>
              }
            >
              <Dropdown.Group>
                <Dropdown.Link href={"/challennges"}>Challenges</Dropdown.Link>
                {!currentUser?.isRegistered && (
                  <>
                    <Dropdown.Button
                      onClick={() => {
                        userAccountModalApi.show("login");
                      }}
                    >
                      Login
                    </Dropdown.Button>
                    <Dropdown.Button
                      onClick={() => {
                        userAccountModalApi.show("signup");
                      }}
                    >
                      Sign Up
                    </Dropdown.Button>
                  </>
                )}
                {currentUser?.isRegistered && <Dropdown.Link href={`/profile/${currentUser?.id}`}>Public Profile</Dropdown.Link>}
              </Dropdown.Group>
              {currentUser?.isRegistered && (
                <Dropdown.Group>
                  <Dropdown.Button onClick={() => logout()}>Logout</Dropdown.Button>
                </Dropdown.Group>
              )}
            </Dropdown>
          </nav>
        </div>
      </header>
      <FlashMessagePortalRoot />
    </>
  );
};

export default Navigation;
