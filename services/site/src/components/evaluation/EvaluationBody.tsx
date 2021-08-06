import { RequirementStatus } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirementTitle: string;
  description: string;
  result: RequirementStatus;
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirementTitle, result, description }) => {
  return (
    <li className={clsx("grid grid-cols-6 gap-2 w-full box-border m-4 ml-8 mb-8", className)}>
      <CollapsableSection passed={result === RequirementStatus.Success ? true : false} title={requirementTitle} description={description} />
    </li>
  );
};

export default EvaluationBody;
