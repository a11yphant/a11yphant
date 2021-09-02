import { EvaluationRequirementResultFragment, RequirementStatus } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirements: EvaluationRequirementResultFragment[];
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirements }) => {
  return (
    <ul className={clsx("h-full", className)}>
      {requirements.map((requirement, idx) => {
        const requirementTitle = `${idx + 1}. ${requirement.title}`;
        return (
          <li key={requirement.id} className="w-full m-4 ml-0 mb-8 grid grid-cols-10 gap-2 box-border max-w-none">
            <CollapsableSection
              passed={requirement.result === RequirementStatus.Success}
              title={requirementTitle}
              description={requirement.description}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default EvaluationBody;
