import ClosedSidebar from "app/components/challenge/sidebar/ClosedSidebar/ClosedSidebar";
import HintSection, { Hints } from "app/components/challenge/sidebar/Sections/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/Sections/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/Sections/ResourceSection";
import SidebarSection from "app/components/challenge/sidebar/SidebarSection";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

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

const openSidebarStyle = {
  sidebar: {
    width: "20rem",
  },
  icon: {
    transform: "rotate(0deg)",
    borderStyle: "solid",
  },
  openDiv: {
    display: "flex",
    opacity: 1,
  },
  closedDiv: {
    display: "none",
    opacity: 0,
  },
};

const closedSidebarStyle = {
  sidebar: {
    width: "4rem",
  },
  icon: {
    transform: "rotate(180deg)",
    borderStyle: "hidden",
  },
  openDiv: {
    display: "none",
    opacity: 0,
  },
  closedDiv: {
    display: "flex",
    opacity: 1,
  },
};

const AnimatedIconOnlyButton = animated(IconOnlyButton);
const AnimatedClosedSidebar = animated(ClosedSidebar);

const Sidebar: React.FunctionComponent<SidebarProps> = ({ classes, instructions, hints, resources }) => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.instructions);
  const [open, setOpen] = useState<boolean>(true);

  const toggleSidebarState = (): void => {
    setOpen((prevState) => !prevState);
  };

  const handleClosedButtonClick = (sectionToOpen: SectionType): void => {
    setActiveSection(sectionToOpen);
    toggleSidebarState();
  };

  const animation: any = useSpring({
    to: async (next) => {
      if (open) {
        await next({ openDivDisplay: openSidebarStyle.openDiv.display });
        await next({
          sidebarWidth: openSidebarStyle.sidebar.width,
          iconTransform: openSidebarStyle.icon.transform,
          iconBorderStyle: openSidebarStyle.icon.borderStyle,
          openDivOpacity: openSidebarStyle.openDiv.opacity,
          closedDivOpacity: openSidebarStyle.closedDiv.opacity,
        });
        await next({ closedDivDisplay: openSidebarStyle.closedDiv.display });
      } else {
        await next({ closedDivDisplay: closedSidebarStyle.closedDiv.display });
        await next({
          sidebarWidth: closedSidebarStyle.sidebar.width,
          iconTransform: closedSidebarStyle.icon.transform,
          iconBorderStyle: closedSidebarStyle.icon.borderStyle,
          openDivOpacity: closedSidebarStyle.openDiv.opacity,
          closedDivOpacity: closedSidebarStyle.closedDiv.opacity,
        });
        await next({ openDivDisplay: closedSidebarStyle.openDiv.display });
      }
    },
    from: {
      sidebarWidth: open ? openSidebarStyle.sidebar.width : closedSidebarStyle.sidebar.width,
      iconTransform: open ? openSidebarStyle.icon.transform : closedSidebarStyle.icon.transform,
      iconBorderStyle: open ? openSidebarStyle.icon.borderStyle : closedSidebarStyle.icon.borderStyle,
      openDivDisplay: open ? openSidebarStyle.openDiv.display : closedSidebarStyle.openDiv.display,
      openDivOpacity: open ? openSidebarStyle.openDiv.opacity : closedSidebarStyle.openDiv.opacity,
      closedDivDisplay: open ? openSidebarStyle.closedDiv.display : closedSidebarStyle.closedDiv.display,
      closedDivOpacity: open ? openSidebarStyle.closedDiv.opacity : closedSidebarStyle.closedDiv.opacity,
    },
    config: {
      duration: 500,
    },
  });

  return (
    <animated.aside
      style={{ width: animation.sidebarWidth }}
      className={`${classes} flex flex-col border-2 rounded-lg border-primary relative box-border overflow-hidden w-1/5`}
    >
      <AnimatedIconOnlyButton
        style={{ transform: animation.iconTransform, borderStyle: animation.iconBorderStyle }}
        className="z-10"
        onClick={toggleSidebarState}
        text={open ? "Close sidebar" : "Open sidebar"}
        icon={<ChevronLeft />}
      />
      <AnimatedClosedSidebar
        style={{ display: animation.closedDivDisplay, opacity: animation.closedDivOpacity }}
        handleClick={handleClosedButtonClick}
        sections={SectionType}
      />
      <animated.div style={{ display: animation.openDivDisplay, opacity: animation.openDivOpacity }} className="flex flex-col h-full absolute">
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
