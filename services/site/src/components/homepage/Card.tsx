import Image from "next/image";
import React from "react";

interface ICardProps {
  className?: string;
  heading: string;
  easy?: boolean;
  medium?: boolean;
  hard?: boolean;
}

const Card: React.FunctionComponent<ICardProps> = ({ className, heading, children, easy, medium, hard }) => {
  let gradient;

  if (easy) {
    gradient = <Image src="/images/01_easy.jpg" alt="" width="500" height="500" />;
  } else if (medium) {
    gradient = <Image src="/images/02_medium.jpg" alt="" width="500" height="500" />;
  } else if (hard) {
    gradient = <Image src="/images/03_hard.jpg" alt="" width="500" height="500" />;
  }

  return (
    <div className={`${className} w-64 h-64 border-2 border-primary rounded-xl flex flex-col justify-end overflow-hidden`}>
      {gradient}
      <div className="p-4 bg-white">
        <h4 className="w-full text-primary font-bold">{heading}</h4>
        <div className="w-full mt-2 text-primary">{children}</div>
      </div>
    </div>
  );
};

export default Card;
