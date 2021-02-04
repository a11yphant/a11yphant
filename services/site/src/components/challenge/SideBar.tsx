import ClosedSidebar from "app/components/challenge/sidebar/ClosedSidebar/ClosedSidebar";
import HintSection, { Hints } from "app/components/challenge/sidebar/Sections/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/Sections/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/Sections/ResourceSection";
import SidebarSection from "app/components/challenge/sidebar/SidebarSection";
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
  instructions = "Instructions",
  hints = "Hints",
  resources = "Resources",
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

  const handleClosedButtonClick = (sectionToOpen: SectionType) => {
    setOpenSection(sectionToOpen);
    toggleSidebarState();
  };

  return (
    <aside
      ref={asideRef}
      className={`${classes} flex flex-col border-2 rounded-lg border-primary relative box-border duration-700 transition-width overflow-hidden w-1/5`}
    >
      <IconOnlyButton buttonRef={buttonRef} onClick={toggleSidebarState} text={updateButtonText} icon={<ChevronLeft />} />
      <ClosedSidebar ref={divClosedRef} handleClick={handleClosedButtonClick} sections={SectionType} />
      <div ref={divOpenRef} className="flex flex-col h-full transition-opacity duration-700">
        <SidebarSection
          title={"Instructions"}
          open={openSection === SectionType.instructions}
          onClick={() => setOpenSection(SectionType.instructions)}
        >
          <InstructionSection {...instructions} />
        </SidebarSection>
        <SidebarSection title={"Hints"} border={true} open={openSection === SectionType.hints} onClick={() => setOpenSection(SectionType.hints)}>
          <HintSection {...hints} />
        </SidebarSection>
        <SidebarSection
          title={"Resources"}
          border={true}
          open={openSection === SectionType.resources}
          onClick={() => setOpenSection(SectionType.resources)}
        >
          <ResourceSection resources={resources} />
        </SidebarSection>
      </div>
    </aside>
  );
};

export default SideBar;
