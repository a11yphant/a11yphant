import HintSection, { Hints } from "app/components/challenge/sidebar/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/ResourceSection";
import React, { useRef, useState } from "react";

import IconOnlyButton from "../buttons/IconOnlyButton";

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

  const changeWidth = () => {
    window.requestAnimationFrame(() => {
      // width animation
      asideRef.current.classList.toggle("w-1/5");
      asideRef.current.classList.toggle("w-16");

      // button animation
      buttonRef.current.classList.toggle("chevron-open");

      // change content
      // delay initially null
      divOpenRef.current.style.transitionDelay = "0ms";
      divClosedRef.current.style.transitionDelay = "0ms";

      // closed to open
      if (getComputedStyle(divOpenRef.current).display === "none") {
        divOpenRef.current.style.transitionDelay = "750ms";
        divClosedRef.current.style.opacity = "0";
        divOpenRef.current.style.opacity = "1";

        setTimeout(() => {
          divClosedRef.current.style.display = "none";
          divOpenRef.current.style.display = "flex";
        }, 750);

        setUpdateButtonText("Close sidebar");
      }
      // open to closed
      else if (getComputedStyle(divClosedRef.current).display === "none") {
        divClosedRef.current.style.transitionDelay = "750ms";
        divOpenRef.current.style.opacity = "0";
        divClosedRef.current.style.opacity = "1";

        setTimeout(() => {
          divOpenRef.current.style.display = "none";
          divClosedRef.current.style.display = "flex";
        }, 750);

        setUpdateButtonText("Open sidebar");
      }
    });
  };

  return (
    <aside
      ref={asideRef}
      className={`${classes} flex flex-col border-2 rounded-lg border-primary relative box-border duration-700 transition-width overflow-hidden w-1/5`}
    >
      <IconOnlyButton buttonRef={buttonRef} onClick={changeWidth} text={updateButtonText} />
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
