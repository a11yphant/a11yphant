import HintSection, { Hints } from "app/components/challenge/sidebar/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/ResourceSection";
import React, { useCallback, useRef, useState } from "react";

import IconOnlyButton from "../buttons/IconOnlyButton";
import ChevronLeft from "../icons/ChevronLeft";

interface SideBarProps {
  classes: string;
  instructions: Instructions;
  hints: Hints;
  resources: Resource[];
}

export enum SectionType {
  instructions = "instructions",
  hints = "hints",
  resources = "resources",
}

const SideBar: React.FunctionComponent<SideBarProps> = ({ classes, instructions, hints, resources }) => {
  const [openSection, setOpenSection] = useState<SectionType>(SectionType.instructions);
  const [updateButtonText, setUpdateButtonText] = useState<string>("Close sidebar");

  // open animation
  const asideRef = useRef<HTMLDivElement>();
  const buttonRef = useRef<HTMLButtonElement>();
  const divClosedRef = useRef<HTMLDivElement>();
  const divOpenRef = useRef<HTMLDivElement>();

  const toggleSidebarState = useCallback(() => {
    window.requestAnimationFrame(() => {
      // toggle sidebar width
      asideRef.current.classList.toggle("w-1/5");
      asideRef.current.classList.toggle("w-16");

      // toggle button icon
      buttonRef.current.classList.toggle("chevron-open");

      // change content
      // set delay to 0 initially
      divOpenRef.current.style.removeProperty("transition-delay");
      divClosedRef.current.style.removeProperty("transition-delay");

      let currentContent, upcomingContent;

      // from closed to open
      if (getComputedStyle(divOpenRef.current).display === "none") {
        currentContent = divClosedRef.current;
        upcomingContent = divOpenRef.current;

        setUpdateButtonText("Close sidebar");
      } else {
        // from open to closed
        currentContent = divOpenRef.current;
        upcomingContent = divClosedRef.current;

        setUpdateButtonText("Open sidebar");
      }

      upcomingContent.style.transitionDelay = "750ms";
      currentContent.style.opacity = "0";
      upcomingContent.style.opacity = "1";

      // Hide current content and show upcoming
      // content after fadeOut animation finished
      setTimeout(() => {
        currentContent.style.display = "none";
        upcomingContent.style.display = "flex";
      }, 750);
    });
  }, [asideRef.current, buttonRef.current, divOpenRef.current, divClosedRef.current]);

  return (
    <aside
      ref={asideRef}
      className={`${classes} flex flex-col border-2 rounded-lg border-primary relative box-border duration-700 transition-width overflow-hidden w-1/5`}
    >
      <IconOnlyButton buttonRef={buttonRef} onClick={toggleSidebarState} text={updateButtonText} icon={<ChevronLeft />} />
      <div ref={divClosedRef} className="hidden h-full flex-col justify-around transition-opacity duration-700">
        <div className="border-b-2 border-primary flex-auto w-full items-center justify-center flex">
          <span className="text-primary transform -rotate-90 text-xl">Instructions</span>
        </div>
        <div className="border-b-2 border-primary flex-auto w-full items-center justify-center flex">
          <span className="text-primary transform -rotate-90 text-xl">Hints</span>
        </div>
        <div className="border-b-2 border-primary flex-auto w-full items-center justify-center flex">
          <span className="text-primary transform -rotate-90 text-xl">Resources</span>
        </div>
      </div>
      <div ref={divOpenRef} className="flex flex-col h-full transition-opacity duration-700">
        <InstructionSection {...instructions} open={openSection === SectionType.instructions} setOpen={setOpenSection} />
        <HintSection {...hints} open={openSection === SectionType.hints} setOpen={setOpenSection} />
        <ResourceSection resources={resources} open={openSection === SectionType.resources} setOpen={setOpenSection} />
      </div>
    </aside>
  );
};

export default SideBar;
