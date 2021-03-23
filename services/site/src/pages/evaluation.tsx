import Button from "app/components/buttons/Button";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import Navigation from "app/components/Navigation";
import React from "react";

const Evaluation: React.FunctionComponent = () => {
  const levelCompleted = false;

  return (
    <div className="w-screen h-screen">
      <Navigation challengeName="Accessible Links" currentLevel="01" maxLevel="03" />
      <main className="flex flex-col justify-between h-18/20 box-border p-8 bg-primary m-4 rounded-lg">
        <EvaluationHeader challengeName="Accessible Links" levelIdx="01"></EvaluationHeader>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              alert("Thank you Mario, but our princess is in another castle!");
            }}
            className="bg-white text-primary px-10"
          >
            {levelCompleted ? "Next Level" : "Retry"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Evaluation;
