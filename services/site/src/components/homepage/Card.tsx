import React from "react";

interface ICardProps {
  className?: string;
  heading: string;
}

const Card: React.FunctionComponent<ICardProps> = ({ className, heading, children }) => {
  return (
    <div className={`${className} w-64 h-64 border-2 border-primary rounded-lg flex flex-col justify-end p-4 my-4`}>
      <h4 className="w-full text-primary font-bold">{heading}</h4>
      <div className="w-full mt-2 text-primary">{children}</div>
    </div>
  );
};

export default Card;
