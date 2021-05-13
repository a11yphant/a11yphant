import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
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
    <header className="flex justify-between items-center pt-8 pb-6 px-11 h-navigation">
      <h1 className="logo">
        <Link href="/">
          <a className="hover:text-primary">
            <A11yphantLogo className={"w-36 text-white"} />
          </a>
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
        {displayUserProfile && <UserAvatar className="ml-4" />}
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
