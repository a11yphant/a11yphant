import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled: boolean;
}

const ToggleButton: React.FunctionComponent<ButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="text-primary font-bold w-full h-16 tracking-wider transition duration-300 hover:bg-primary hover:text-white focus:text-white focus:bg-primary"
    >
      {text}
    </button>
  );
};

export default ToggleButton;
