import { SectionType } from "app/components/challenge/SideBar";
import React from "react";

interface ClosedSidebarProps {
  handleClick: (sectionType: SectionType) => void;
  sections: typeof SectionType;
}

const ClosedSidebar = React.forwardRef<HTMLDivElement, ClosedSidebarProps>(({ handleClick, sections }, ref) => {
  return (
    <div ref={ref} className="hidden h-full flex-col justify-around transition-opacity duration-700">
      {Object.values(sections).map((section: SectionType) => (
        <div
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
});

export default ClosedSidebar;
