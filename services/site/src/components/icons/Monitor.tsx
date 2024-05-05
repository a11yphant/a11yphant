import clsx from "clsx";
import React from "react";

interface MonitorProps {
  className?: string;
}

const Monitor: React.FunctionComponent<MonitorProps> = ({ className, ...props }) => {
  return (
    <svg
      width="75"
      height="66"
      viewBox="0 0 75 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("text-gray-300 shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M26.7773 63.7159L32.2205 50.2377H43.1067L48.5498 63.7159H26.7773Z" fill="white" />
      <path
        d="M70.3203 1.71582H5.00281C4.28101 1.71582 3.58877 1.99982 3.07838 2.50536C2.56799 3.01089 2.28125 3.69653 2.28125 4.41146V47.5417C2.28125 48.2567 2.56799 48.9423 3.07838 49.4478C3.58877 49.9534 4.28101 50.2374 5.00281 50.2374H70.3203C71.0421 50.2374 71.7343 49.9534 72.2447 49.4478C72.7551 48.9423 73.0418 48.2567 73.0418 47.5417V4.41146C73.0418 3.69653 72.7551 3.01089 72.2447 2.50536C71.7343 1.99982 71.0421 1.71582 70.3203 1.71582Z"
        stroke="white"
        strokeWidth="2.85714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32.2205 50.2377L26.7773 63.7159" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43.1055 50.2377L48.5486 63.7159" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.334 63.7155H53.9927" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.0548 19.2372L14.5293 27.3241L22.694 34.0632" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52.6284 20.5853L60.793 27.3244L51.2676 35.4114" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33.5781 38.1068L41.7428 13.8461" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Monitor;
