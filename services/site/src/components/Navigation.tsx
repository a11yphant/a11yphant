import React from "react";

import Avatar from "./icons/Avatar";
import Home from "./icons/Home";
import Save from "./icons/Save";
import Slash from "./icons/Slash";

interface NavigationProps {
  challengeName: string;
  currentLevel: string;
  maxLevel: string;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ challengeName, currentLevel, maxLevel }) => {
  return (
    <header className="flex justify-between items-center p-6 h-1/20">
      <h1 className="logo">A11y Challenges</h1>
      <div className="flex justify-center items-center">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center">
            <li>
              <div>
                <a href="/" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Home</span>
                  <Home />
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <Slash />
                <a href="/" className="ml-1 text-gray-500 hover:text-primaryDark">
                  Dashboard
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <Slash />
                <a href="/" aria-current="page" className="ml-1 text-primary hover:text-primaryDark">
                  {challengeName}
                </a>
              </div>
            </li>
          </ol>
        </nav>
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
