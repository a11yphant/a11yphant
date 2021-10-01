import { Factory as RosieFactory } from "rosie";

import * as AnswerOptionFactory from "./answer-option.factory";
import * as ChallengeFactory from "./challenge.factory";
import * as CheckResultFactory from "./check-result.factory";
import * as LevelFactory from "./code-level.factory";
import * as HintFactory from "./hint.factory";
import * as QuizLevelFactory from "./quiz-level.factory";
import * as QuizLevelSubmissionFactory from "./quiz-level-submission.factory";
import * as RequirementFactory from "./requirement.factory";
import * as ResultFactory from "./result.factory";
import * as RuleFactory from "./rule.factory";
import * as SubmissionFactory from "./submission.factory";
import * as TaskFactory from "./task.factory";
import * as UserFactory from "./user.factory";

const factories = [
  ChallengeFactory,
  CheckResultFactory,
  HintFactory,
  LevelFactory,
  RequirementFactory,
  ResultFactory,
  RuleFactory,
  SubmissionFactory,
  TaskFactory,
  UserFactory,
  QuizLevelFactory,
  AnswerOptionFactory,
  QuizLevelSubmissionFactory,
];

factories.forEach((factory) => {
  factory.define(RosieFactory);
});

export const Factory = RosieFactory;
