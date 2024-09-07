import clsx from "clsx";
import React from "react";

const A11yphantLogoWithoutText: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg viewBox="0 0 2000 1600" fill="currentColor" className={clsx(className)} aria-hidden="true" {...props}>
      <path
        fill="#7331ff"
        d="M464.93,1492.46C230.62,1492.46,40,1301.84,40,1067.54H354.78a110.15,110.15,0,0,0,220.29,0V800c0-381.83,310.64-692.46,692.47-692.46S1960,418.17,1960,800v535.07H1645.22V800c0-208.27-169.42-377.68-377.68-377.68S889.86,591.73,889.86,800v267.54C889.86,1301.84,699.23,1492.46,464.93,1492.46Z"
      />
    </svg>
  );
};

export default A11yphantLogoWithoutText;
