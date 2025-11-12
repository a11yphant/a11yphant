"use client";

import { ResultStatus } from "app/generated/graphql";
import { getNumFailedLevelsInARowKey } from "app/hooks/sessionState/sessionStateKeys";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
import React from "react";

interface EvaluationResultClientSideProps {
  status: ResultStatus;
  challengeSlug: string;
  nthLevel: number;
}

export const SaveFailedLevelsInSessionStorage = ({ status, challengeSlug, nthLevel }: EvaluationResultClientSideProps): JSX.Element => {
  const key = getNumFailedLevelsInARowKey(challengeSlug, String(nthLevel));
  const [, setFailedLevelsInARow] = useSessionState<number>(key, 0);
  const statusRef = React.useRef<ResultStatus>();

  React.useEffect(() => {
    // for some reason this hook is executed twice with the same status
    if (status === statusRef.current) {
      return;
    }

    if (status === ResultStatus.Fail) {
      setFailedLevelsInARow((prev) => (prev ? prev + 1 : 1));
    } else if (status === ResultStatus.Success) {
      setFailedLevelsInARow(0);
    }

    statusRef.current = status;
  }, [setFailedLevelsInARow, status]);

  return null;
};
