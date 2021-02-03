import HintSection, { Hints } from "app/components/challenge/sidebar/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/ResourceSection";
import React, { useRef, useState } from "react";

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

  // open animation
  const asideRef = useRef<HTMLDivElement>();
  const buttonRef = useRef<HTMLButtonElement>();
  const divClosedRef = useRef<HTMLDivElement>();
  const divOpenRef = useRef<HTMLDivElement>();

  const changeWidth = () => {
    // width animation
    const currentWidth = asideRef.current.style.width;
    asideRef.current.style.width = currentWidth === "20%" ? "5rem" : "20%";

    // button animation
    buttonRef.current.classList.toggle("chevron-open");

    // change content
    // delay initially null
    divOpenRef.current.style.transitionDelay = "0";
    divClosedRef.current.style.transitionDelay = "0";

    // closed to open
    if (getComputedStyle(divOpenRef.current).display === "none") {
      divOpenRef.current.style.transitionDelay = "700";
      divClosedRef.current.style.opacity = "0";
      setTimeout(() => {
        divClosedRef.current.style.display = "none";
      }, 700);
      divOpenRef.current.style.opacity = "1";
      setTimeout(() => {
        divOpenRef.current.style.display = "flex";
      }, 700);
    }
    // open to closed
    else if (getComputedStyle(divClosedRef.current).display === "none") {
      divClosedRef.current.style.transitionDelay = "700";
      divOpenRef.current.style.opacity = "0";
      setTimeout(() => {
        divOpenRef.current.style.display = "none";
      }, 700);
      divClosedRef.current.style.opacity = "1";
      setTimeout(() => {
        divClosedRef.current.style.display = "flex";
      }, 700);
    }
  };

  return (
    <aside
      ref={asideRef}
      style={{ width: "20%" }}
      className={`${classes} flex flex-col border-2 rounded-lg border-primary relative box-border duration-700 transition-width overflow-hidden`}
    >
      <button
        ref={buttonRef}
        onClick={changeWidth}
        className="border-l-2 border-b-2 border-primary p-4 h-16 absolute -top-px -right-px box-border text-2xl transition duration-700"
      >
        <ChevronLeft />
      </button>
      <div ref={divClosedRef} className="h-full flex-col justify-around hidden transition-opacity duration-700">
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
