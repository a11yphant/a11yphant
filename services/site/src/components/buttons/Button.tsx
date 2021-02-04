import React from "react";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  full?: boolean;
  classes?: string;
}

const Button: React.FunctionComponent<ButtonProps> = ({ full = false, classes, children, ...props }) => {
  return (
    <button
      className={`${
        full ? "bg-primary text-white" : ""
      } border-primary border-2 rounded-lg px-4 py-2 tracking-wider inline-flex items-center transition duration-300 hover:text-white hover:bg-primaryDark focus:text-white focus:bg-primaryDark ${classes}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
