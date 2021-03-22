import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import Navigation from "app/components/Navigation";
import { useChallengeQuery } from "app/generated/graphql";
import React from "react";

const challengeId = "242003d6-402e-49b7-9ec2-702445b37c8e";

const Evaluation: React.FunctionComponent = () => {
  const { loading } = useChallengeQuery({ variables: { id: challengeId } });

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="w-screen h-screen">
      <Navigation challengeName="Accessible Links" currentLevel="01" maxLevel="03" />
      <main className="flex justify-between h-18/20 box-border p-8 bg-primary m-4 rounded-lg">
        <EvaluationHeader challenge="Accessible Links" level="01"></EvaluationHeader>
      </main>
    </div>
  );
};

export default Evaluation;
