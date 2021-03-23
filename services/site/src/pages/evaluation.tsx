import Button from "app/components/buttons/Button";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import Navigation from "app/components/Navigation";
import React from "react";

const Evaluation: React.FunctionComponent = () => {
  const levelCompleted = false;

  const mockData = {
    requirement: "1.0 The link can be activated using the mouse",
    check: {
      title: "1.1 Global Requirements",
      description:
        "The HTML code must comply to all markup rules established by the W3C. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus donec mattis sit accumsan, pulvinar in felis, vel arcu. Eu pellentesque purus amet, nibh eget.",
    },
  };

  return (
    <div className="w-screen h-screen">
      <Navigation challengeName="Accessible Links" currentLevel="01" maxLevel="03" />
      <main className="flex flex-col justify-between h-18/20 box-border p-8 bg-primary m-4 rounded-lg">
        <EvaluationHeader challengeName="Accessible Links" levelIdx="01"></EvaluationHeader>
        <EvaluationBody requirementTitle={mockData.requirement} checks={mockData.check} />
        <div className="absolute bottom-8 right-8">
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
