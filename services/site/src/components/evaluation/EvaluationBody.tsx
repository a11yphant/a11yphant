import { RequirementStatus } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirementTitle: string;
  result: RequirementStatus;
  description: string;
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirementTitle, result, description }) => {
  return (
    <li className={clsx("w-full m-4 ml-0 mb-8 grid grid-cols-10 gap-2 box-border max-w-none", className)}>
      <CollapsableSection passed={result === RequirementStatus.Success ? true : false} title={requirementTitle} description={description} />
    </li>
  );
};

export default EvaluationBody;
