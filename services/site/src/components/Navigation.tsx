import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import Link from "next/link";
import React from "react";

import Button from "./buttons/Button";
import Save from "./icons/Save";
import UserAvatar from "./icons/UserAvatar";

interface NavigationProps {
  displayBreadcrumbs?: boolean;
  displaySave?: boolean;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ displayBreadcrumbs = true, displaySave = false }) => {
  // TODO: replace when login is implemented
  const displayUserProfile = true;
  const displayRegistration = false;

  return (
    <header className="flex justify-between items-center p-6 h-1/20">
      <h1 className="logo">
        <Link href="/">
          <a className="hover:text-primary">A11y Challenges</a>
        </Link>
      </h1>
      {displayBreadcrumbs && (
        <>
          <div className="flex justify-center items-center">
            <Breadcrumbs />
          </div>
        </>
      )}
      <div className="flex justify-center items-center">
        {displaySave && <Save />}
        {displayUserProfile && (
          <>
            <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100 ml-8">
              <UserAvatar />
            </span>
          </>
        )}
        {displayRegistration && (
          <>
            <Button full className="mx-4">
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
