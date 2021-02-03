import React from "react";

import ArrowRight from "../icons/ArrowRight";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const IconButton: React.FunctionComponent<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border-2 rounded-lg border-primary bg-primary px-4 py-2 tracking-wider inline-flex items-center transition duration-300 text-white hover:text-white hover:bg-primaryDark focus:text-white focus:bg-primaryDark"
    >
      {text}
      <ArrowRight />
    </button>
  );
};

export default IconButton;
