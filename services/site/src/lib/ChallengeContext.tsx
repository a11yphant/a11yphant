import React, { useState } from "react";

interface ChallengeContextValues {
  submissionId?: string;
  setSubmissionId: (submissionId: string) => void;
}

const ChallengeContext = React.createContext<ChallengeContextValues>({
  setSubmissionId: () => {
    return;
  },
});

export const useChallenge = (): ChallengeContextValues => {
  return React.useContext(ChallengeContext);
};

const ChallengeContextProvider: React.FunctionComponent = ({ children }) => {
  const [submissionId, setSubmissionId] = useState<string>();

  return <ChallengeContext.Provider value={{ submissionId, setSubmissionId }}>{children}</ChallengeContext.Provider>;
};

export default ChallengeContextProvider;
