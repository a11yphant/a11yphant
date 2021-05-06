import { SectionType } from "app/components/challenge/Sidebar";
import React, { HTMLAttributes } from "react";

interface ClosedSidebarProps extends HTMLAttributes<HTMLDivElement> {
  handleClick: (sectionType: SectionType) => void;
  sections: typeof SectionType;
}

const ClosedSidebar: React.FunctionComponent<ClosedSidebarProps> = ({ handleClick, sections, className, ...props }) => {
  return (
    <div {...props} className={`flex flex-col h-full justify-around ${className}`}>
      {Object.values(sections).map((section: SectionType) => (
        <div
          key={section}
          onClick={() => handleClick(section)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleClick(section);
            }
          }}
          tabIndex={0}
          role="button"
          className="border-b-2 border-primary flex-auto w-full items-center justify-center flex transition duration-300 group hover:bg-primary group-hover:text-white group-focus:text-white focus:bg-primary"
        >
          <span className="text-primary transform -rotate-90 text-xl group-hover:text-white group-focus:text-white">{section}</span>
        </div>
      ))}
    </div>
  );
};

export default ClosedSidebar;
