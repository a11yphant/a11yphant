import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  buttonRef: React.MutableRefObject<HTMLButtonElement>;
  icon: React.ReactNode;
}

const IconOnlyButton: React.FunctionComponent<ButtonProps> = ({ text, onClick, buttonRef, icon }) => {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="border-l-2 border-b-2 border-primary p-4 h-16 absolute bg-white right-0 box-border text-2xl transition duration-700 group group-focus:text-white hover:bg-primary focus:bg-primary"
    >
      <span className="sr-only">{text}</span>
      {icon}
    </button>
  );
};

export default IconOnlyButton;
