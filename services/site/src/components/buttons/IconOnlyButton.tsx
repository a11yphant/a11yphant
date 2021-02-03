import React from "react";

import ChevronLeft from "../icons/ChevronLeft";

interface ButtonProps {
  text: string;
  onClick: () => void;
  buttonRef: React.MutableRefObject<HTMLButtonElement>;
}

const IconOnlyButton: React.FunctionComponent<ButtonProps> = ({ text, onClick, buttonRef }) => {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="border-l-2 border-b-2 border-primary p-4 h-16 absolute bg-white right-0 box-border text-2xl transition duration-700 group group-focus:text-white hover:bg-primary focus:bg-primary"
    >
      <span className="sr-only">{text}</span>
      <ChevronLeft />
    </button>
  );
};

export default IconOnlyButton;
