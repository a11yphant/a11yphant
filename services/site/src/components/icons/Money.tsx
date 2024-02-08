import clsx from "clsx";
import React from "react";

interface MoneyProps {
  className?: string;
}

const Money: React.FunctionComponent<MoneyProps> = ({ className, ...props }) => {
  return (
    <svg
      width="66"
      height="69"
      viewBox="0 0 66 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("text-gray-300 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M30.9143 64.8085C47.7662 64.8085 59.8032 58.8472 59.8032 45.5787C59.8032 31.1565 52.581 21.5416 38.1365 14.3305L43.818 7.02322C44.1067 6.54381 44.2632 5.9967 44.2718 5.43737C44.2804 4.87803 44.1408 4.32639 43.867 3.83831C43.5933 3.35024 43.1952 2.9431 42.7131 2.65817C42.2309 2.37323 41.682 2.22063 41.1217 2.21582H20.7069C20.1466 2.22063 19.5976 2.37323 19.1155 2.65817C18.6334 2.9431 18.2353 3.35024 17.9616 3.83831C17.6878 4.32639 17.5482 4.87803 17.5568 5.43737C17.5654 5.9967 17.7219 6.54381 18.0106 7.02322L23.6921 14.3786C9.24762 21.6378 2.02539 31.2526 2.02539 45.6749C2.02539 58.8472 14.0624 64.8085 30.9143 64.8085Z"
        stroke="white"
        strokeWidth="2.85714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.5717 32.5767C37.3427 31.9288 36.9894 31.3398 36.5403 30.838C35.5853 29.7709 34.1973 29.0994 32.6525 29.0994H28.6151C26.0436 29.0994 23.959 31.1839 23.959 33.7554C23.959 35.9434 25.4825 37.8363 27.6201 38.3039L33.7671 39.6485C36.1618 40.1724 37.8686 42.2944 37.8686 44.7457C37.8686 47.6265 35.5332 49.9639 32.6525 49.9639H29.1751C26.904 49.9639 24.9719 48.5122 24.2558 46.4863"
        stroke="white"
        strokeWidth="2.85714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30.9141 29.0985V23.8824" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.9141 55.1794V49.963" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M63.6681 67.2158L1.95703 5.50476" stroke="white" strokeWidth="2.85714" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Money;
