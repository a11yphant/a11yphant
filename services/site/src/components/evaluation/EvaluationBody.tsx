import { RuleStatus } from "app/generated/graphql";
import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirementTitle: string;
  description: string;
  result: RuleStatus;
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirementTitle, result, description }) => {
  return (
    <div className={`${className} flex flex-col items-left w-full box-border h-full m-auto mb-8`}>
      <CollapsableSection passed={result === RuleStatus.Success ? true : false} title={requirementTitle} description={description} />
    </div>
  );
};

export default EvaluationBody;
