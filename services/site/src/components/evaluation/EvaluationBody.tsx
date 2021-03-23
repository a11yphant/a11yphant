import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className }) => {
  return (
    <div className={`${className} flex flex-col items-left w-full box-border h-full max-w-7xl m-auto mt-24 mb-4`}>
      <h3 className="text-white font-bold h2 mb-2">1.0 The link can be activated using the mouse</h3>
      <CollapsableSection passed={true} />
    </div>
  );
};

export default EvaluationBody;
