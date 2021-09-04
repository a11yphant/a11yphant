import { EvaluationRequirementResultFragment, RequirementStatus } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirements: EvaluationRequirementResultFragment[];
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirements }) => {
  const successfulRequirement = requirements.filter((requirement) => requirement.result === RequirementStatus.Success);
  const failedRequirement = requirements.filter((requirement) => requirement.result === RequirementStatus.Fail);

  return (
    <>
      {failedRequirement.length >= 1 && (
        <ul className={clsx("h-full", className)}>
          {failedRequirement.map((requirement, idx) => {
            const requirementTitle = `${requirement.title}`;
            return (
              <>
                <li key={requirement.id} className="w-full m-4 ml-0 mb-8 first:mt-0 grid grid-cols-10 gap-2 box-border max-w-none">
                  <CollapsableSection passed={false} title={requirementTitle} description={requirement.description} />
                </li>
              </>
            );
          })}
        </ul>
      )}
      {successfulRequirement.length >= 1 && (
        <ul className={clsx("h-full", className)}>
          {successfulRequirement.map((requirement, idx) => {
            const requirementTitle = `${requirement.title}`;
            return (
              <>
                <li key={requirement.id} className="w-full m-4 ml-0 mb-8 first:mt-0 grid grid-cols-10 gap-2 box-border max-w-none">
                  <CollapsableSection passed={true} title={requirementTitle} description={requirement.description} />
                </li>
              </>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default EvaluationBody;
