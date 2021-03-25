import { Check } from "app/generated/graphql";
import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirementTitle: string;
  checks: Check[];
  requirementIdx: number;
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirementTitle, checks, requirementIdx }) => {
  // render checks
  const getChecks = checks.map((check, idx) => {
    const checkTitle = `${requirementIdx}.${idx + 1} ${check.title}`;
    return (
      <CollapsableSection key={check.id} passed={check.result === "SUCCESS" ? true : false} title={checkTitle} description={check.description} />
    );
  });

  return (
    <div className={`${className} flex flex-col items-left w-full box-border h-full m-auto mb-8`}>
      <h3 className="text-white font-bold h2 mb-2"> {requirementTitle}</h3>
      {getChecks}
    </div>
  );
};

export default EvaluationBody;
