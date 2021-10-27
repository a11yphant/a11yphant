import { EvaluationRequirementResultFragment, RequirementStatus } from "app/generated/graphql";
import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirements: EvaluationRequirementResultFragment[];
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirements }) => {
  const successfulRequirements = requirements.filter((requirement) => requirement.result === RequirementStatus.Success);
  const failedRequirements = requirements.filter((requirement) => requirement.result === RequirementStatus.Fail);

  return (
    <>
      {failedRequirements.length >= 1 && (
        <ul className={className}>
          {failedRequirements.map((requirement, idx) => {
            const requirementTitle = `${requirement.title}`;
            return (
              <li key={requirement.id} className="w-full m-4 ml-0 mb-8 first:mt-0 grid grid-cols-10 gap-2 box-border max-w-none">
                <CollapsableSection passed={false} title={requirementTitle} description={requirement.description} />
              </li>
            );
          })}
        </ul>
      )}
      {successfulRequirements.length >= 1 && (
        <ul className={className}>
          {successfulRequirements.map((requirement, idx) => {
            const requirementTitle = `${requirement.title}`;
            return (
              <li key={requirement.id} className="w-full m-4 ml-0 mb-8 first:mt-0 grid grid-cols-10 gap-2 box-border max-w-none">
                <CollapsableSection passed={true} title={requirementTitle} description={requirement.description} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default EvaluationBody;
