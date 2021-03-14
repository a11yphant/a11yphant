import ClosedSidebar from "app/components/challenge/sidebar/ClosedSidebar/ClosedSidebar";
import HintSection, { Hints } from "app/components/challenge/sidebar/Sections/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/Sections/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/Sections/ResourceSection";
import SidebarSection from "app/components/challenge/sidebar/SidebarSection";
import React, { useState } from "react";
import { animated, useChain } from "react-spring";
import { useSpring } from "react-spring";

import IconOnlyButton from "../buttons/IconOnlyButton";
import ChevronLeft from "../icons/ChevronLeft";

interface SidebarProps {
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

const AnimatedIconOnlyButton = animated(IconOnlyButton);
const AnimatedClosedSidebar = animated(ClosedSidebar);

const Sidebar: React.FunctionComponent<SidebarProps> = ({ classes, instructions, hints, resources }) => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.instructions);
  const [open, setOpen] = useState<boolean>(true);

  // const toggleSidebarState = useCallback(() => {
  //   window.requestAnimationFrame(() => {
  //     // toggle sidebar width
  //     asideRef.current.classList.toggle("w-1/5");
  //     asideRef.current.classList.toggle("w-16");
  //
  //     // toggle button icon
  //     buttonRef.current.classList.toggle("chevron-open");
  //
  //     // change content
  //     // set delay to 0 initially
  //     divOpenRef.current.style.removeProperty("transition-delay");
  //     divClosedRef.current.style.removeProperty("transition-delay");
  //
  //     let currentContent, upcomingContent;
  //
  //     // from closed to open
  //     if (getComputedStyle(divOpenRef.current).display === "none") {
  //       currentContent = divClosedRef.current;
  //       upcomingContent = divOpenRef.current;
  //
  //       setUpdateButtonText("Close sidebar");
  //     } else {
  //       // from open to closed
  //       currentContent = divOpenRef.current;
  //       upcomingContent = divClosedRef.current;
  //
  //       setUpdateButtonText("Open sidebar");
  //     }
  //
  //     upcomingContent.style.transitionDelay = "750ms";
  //     currentContent.style.opacity = "0";
  //     upcomingContent.style.opacity = "1";
  //
  //     // Hide current content and show upcoming
  //     // content after fadeOut animation finished
  //     setTimeout(() => {
  //       window.requestAnimationFrame(() => {
  //         currentContent.style.display = "none";
  //         upcomingContent.style.display = "flex";
  //       });
  //     }, 750);
  //   });
  // }, [asideRef, buttonRef, divOpenRef, divClosedRef]);

  const toggleSidebarState = (): void => {
    setOpen((prevState) => !prevState);
  };

  const handleClosedButtonClick = (sectionToOpen: SectionType): void => {
    setActiveSection(sectionToOpen);
    toggleSidebarState();
  };

  const asideSpring = useSpring({
    width: open ? "20%" : "4rem",
  });

  const iconSpring = useSpring({
    transform: open ? "rotate(0deg)" : "rotate(180deg)",
  });

  const openOpacityRef = React.useRef();
  const { opacity: openDivOpacity } = useSpring({
    opacity: open ? 1 : 0,
    ref: openOpacityRef,
  });
  const openDisplayRef = React.useRef();
  const { display: openDivDisplay } = useSpring({
    display: open ? "flex" : "none",
    ref: openDisplayRef,
  });
  useChain(open ? [openDisplayRef, openOpacityRef] : [openOpacityRef, openDisplayRef]);

  const closedOpacityRef = React.useRef();
  const { opacity: closedDivOpacity } = useSpring({
    opacity: open ? 0 : 1,
    ref: closedOpacityRef,
  });
  const closedDisplayRef = React.useRef();
  const { display: closedDivDisplay } = useSpring({
    display: open ? "none" : "flex",
    ref: closedDisplayRef,
  });
  useChain(open ? [closedOpacityRef, closedDisplayRef] : [closedDisplayRef, closedOpacityRef]);

  return (
    <animated.aside
      style={asideSpring}
      className={`${classes} flex flex-col border-2 rounded-lg border-primary relative box-border overflow-hidden w-1/5`}
    >
      <AnimatedIconOnlyButton
        style={{ zIndex: 10, ...iconSpring }}
        onClick={toggleSidebarState}
        text={open ? "Close sidebar" : "Open sidebar"}
        icon={<ChevronLeft />}
      />
      <AnimatedClosedSidebar
        style={{ display: closedDivDisplay, opacity: closedDivOpacity, position: "absolute" }}
        handleClick={handleClosedButtonClick}
        sections={SectionType}
      />
      <animated.div style={{ display: openDivDisplay, opacity: openDivOpacity, position: "absolute" }} className="flex flex-col h-full">
        <SidebarSection
          title={"Instructions"}
          open={activeSection === SectionType.instructions}
          onClick={() => setActiveSection(SectionType.instructions)}
        >
          <InstructionSection {...instructions} />
        </SidebarSection>
        <SidebarSection title={"Hints"} border={true} open={activeSection === SectionType.hints} onClick={() => setActiveSection(SectionType.hints)}>
          <HintSection {...hints} />
        </SidebarSection>
        <SidebarSection
          title={"Resources"}
          border={true}
          open={activeSection === SectionType.resources}
          onClick={() => setActiveSection(SectionType.resources)}
        >
          <ResourceSection resources={resources} />
        </SidebarSection>
      </animated.div>
    </animated.aside>
  );
};

export default Sidebar;
