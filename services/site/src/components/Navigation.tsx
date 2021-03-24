import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import { useBreadcrumbs } from "app/components/breadcrumbs/BreadcrumbsContext";
import React from "react";

import Avatar from "./icons/Avatar";
import Save from "./icons/Save";
import Slash from "./icons/Slash";

interface NavigationProps {
  challengeName: string;
  currentLevel: string;
  maxLevel: string;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ challengeName, currentLevel, maxLevel }) => {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <header className="flex justify-between items-center p-6 h-1/20">
      <h1 className="logo">A11y Challenges</h1>
      <div className="flex justify-center items-center">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="flex items-center text-primary ml-4">
          <span>{currentLevel}</span>
          <Slash classes="text-primary" />
          <span>{maxLevel}</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Save />
        <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100 ml-8">
          <Avatar />
        </span>
      </div>
    </header>
  );
};
export default Navigation;
