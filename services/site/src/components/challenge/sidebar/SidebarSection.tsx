import ToggleButton from "app/components/challenge/sidebar/ToggleButton";
import React from "react";

interface SidebarSectionProps {
  title: string;
  border?: boolean;
  open: boolean;
  onClick: () => void;
}

const SidebarSection: React.FunctionComponent<SidebarSectionProps> = ({ title, border = false, open, onClick, children }) => {
  return (
    <>
      <h3 className={`${open === true ? "disableBtn" : ""} flex items-center justify-center h-16 ${border ? "border-t-2 border-primary" : ""}`}>
        <ToggleButton onClick={onClick} text={title} disabled={open} />
      </h3>
      {open ? children : null}
    </>
  );
};

export default SidebarSection;
