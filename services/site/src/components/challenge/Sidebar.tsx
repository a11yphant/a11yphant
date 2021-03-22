import ClosedSidebar from "app/components/challenge/sidebar/ClosedSidebar/ClosedSidebar";
import HintSection from "app/components/challenge/sidebar/Sections/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/Sections/InstructionSection";
import ResourceSection from "app/components/challenge/sidebar/Sections/ResourceSection";
import SidebarSection from "app/components/challenge/sidebar/SidebarSection";
import { Hint, HintIdFragment, Resource, useHintLazyQuery } from "app/generated/graphql";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

import IconOnlyButton from "../buttons/IconOnlyButton";
import ChevronLeft from "../icons/ChevronLeft";

interface SidebarProps {
  classes: string;
  instructions: Instructions;
  hints: HintIdFragment[];
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
  const [getNextHint, { data }] = useHintLazyQuery();
  const [usedHints, setUsedHints] = useState<Hint[]>([]);

  const toggleSidebarState = (): void => {
    setOpen((prevState) => !prevState);
  };

  const handleClosedButtonClick = (sectionToOpen: SectionType): void => {
    setActiveSection(sectionToOpen);
    toggleSidebarState();
  };

  const loadNextHint = (): void => {
    if (usedHints.length === hints.length) {
      return;
    }

    const nextHintId = hints[usedHints.length].id;
    getNextHint({ variables: { id: nextHintId } });
  };

  React.useEffect(() => {
    if (data?.hint) {
      const nextHint = data.hint;
      setUsedHints((prevHints) => [...prevHints, nextHint]);
    }
  }, [data]);

  // any is necessary here because the types of react-spring are somehow messed up
  const animation: any = useSpring({
    to: async (next) => {
      if (open) {
        // Fade out closed div
        await next({
          closedDivOpacity: openSidebarStyle.closedDiv.opacity,
          config: {
            duration: 200,
          },
        });

        // Hide closed div
        await next({
          closedDivDisplay: openSidebarStyle.closedDiv.display,
          config: {
            duration: 1,
          },
        });

        // Show open div
        await next({
          openDivDisplay: openSidebarStyle.openDiv.display,
          config: {
            duration: 1,
          },
        });

        // Increase width and rest
        await next({
          sidebarWidth: openSidebarStyle.sidebar.width,
          iconTransform: openSidebarStyle.icon.transform,
          iconBorderStyle: openSidebarStyle.icon.borderStyle,
          openDivOpacity: openSidebarStyle.openDiv.opacity,
        });
      } else {
        // Shrink width and rest
        await next({
          sidebarWidth: closedSidebarStyle.sidebar.width,
          iconTransform: closedSidebarStyle.icon.transform,
          iconBorderStyle: closedSidebarStyle.icon.borderStyle,
          openDivOpacity: closedSidebarStyle.openDiv.opacity,
        });

        // Hide open div
        await next({
          openDivDisplay: closedSidebarStyle.openDiv.display,
        });

        // Show closed div
        await next({
          closedDivDisplay: closedSidebarStyle.closedDiv.display,
        });

        // Fade in closed div
        await next({
          closedDivOpacity: closedSidebarStyle.closedDiv.opacity,
        });
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
      <animated.div style={{ display: animation.openDivDisplay, opacity: animation.openDivOpacity }} className="flex flex-col w-80 h-full absolute">
        <SidebarSection
          title={"Instructions"}
          open={activeSection === SectionType.instructions}
          onClick={() => setActiveSection(SectionType.instructions)}
        >
          <InstructionSection {...instructions} />
        </SidebarSection>
        <SidebarSection title={"Hints"} border={true} open={activeSection === SectionType.hints} onClick={() => setActiveSection(SectionType.hints)}>
          <HintSection hints={hints} usedHints={usedHints} loadNextHint={loadNextHint} />
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
