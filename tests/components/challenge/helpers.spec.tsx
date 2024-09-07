import { isCodeLevel, isQuizLevel } from "app/components/challenge/helpers";
import { CodeLevelDetailsFragment, QuizLevelDetailsFragment } from "app/generated/graphql";

const mockCodeLevel: CodeLevelDetailsFragment = {
  __typename: "CodeLevel",
  id: "1",
  instructions: "This is a instruction.",
  tasks: [
    {
      id: "11",
      text: "This is the first task.",
      hints: [
        {
          id: "111",
          text: "This is a hint.",
        },
      ],
    },
  ],
  code: {
    html: "html",
    css: "css",
    js: "js",
  },
};
const mockQuizLevel: QuizLevelDetailsFragment = {
  __typename: "QuizLevel",
  id: "1",
  question: "This is a question.",
  answerOptions: [
    {
      id: "11",
      text: "This is the first task.",
    },
  ],
};

describe("helpers", () => {
  it("is a quiz level", () => {
    const quizLevel = isQuizLevel(mockQuizLevel);

    expect(quizLevel).toBeTruthy();
  });

  it("is a code level", () => {
    const codeLevel = isCodeLevel(mockCodeLevel);

    expect(codeLevel).toBeTruthy();
  });
});
