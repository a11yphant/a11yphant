import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick: () => void;
  icon: React.ReactNode;
}

const IconOnlyButton: React.FunctionComponent<ButtonProps> = ({ text, onClick, icon, ...props }) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className="border-l-2 border-b-2 border-primary p-4 h-16 absolute bg-white right-0 box-border text-2xl group group-focus:text-white hover:bg-primary focus:bg-primary"
    >
      <span className="sr-only">{text}</span>
      {icon}
    </button>
  );
};

export default IconOnlyButton;
