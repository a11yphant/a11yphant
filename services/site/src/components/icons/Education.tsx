import clsx from "clsx";
import React from "react";

interface EducationProps {
  className?: string;
}

const Education: React.FunctionComponent<EducationProps> = ({ className, ...props }) => {
  return (
    <svg
      width="55"
      height="69"
      viewBox="0 0 55 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("text-gray-300 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M27.7671 32.4594C24.0173 29.6835 18.3852 24.8295 2.25195 24.8295V59.5858C18.3852 59.5858 24.0173 64.4399 27.7671 67.2158V32.4594Z"
        stroke="white"
        strokeWidth="2.85714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.7656 32.4594C31.5204 29.6835 37.1474 24.8295 53.2807 24.8295V59.5858C37.1474 59.5858 31.5204 64.4399 27.7656 67.2158V32.4594Z"
        stroke="white"
        strokeWidth="2.85714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46.6545 2.21582H13.138C12.2016 2.21469 11.2835 2.4755 10.4876 2.96878L1.66797 8.46032L10.4876 13.9418C11.2835 14.4351 12.2016 14.6959 13.138 14.6948H46.6545C48.278 14.6487 49.8195 13.9714 50.9516 12.8068C52.0837 11.6421 52.717 10.082 52.717 8.45781C52.717 6.83364 52.0837 5.27348 50.9516 4.10885C49.8195 2.94422 48.278 2.26691 46.6545 2.22084V2.21582Z"
        stroke="white"
        strokeWidth="2.85714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M37.7344 2.48682V14.6947" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Education;
