import { Factory as RosieFactory } from "rosie";

import * as ChallengeFactory from "./challenge.factory";
import * as CheckResultFactory from "./check-result.factory";
import * as HintFactory from "./hint.factory";
import * as LevelFactory from "./level.factory";
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
];

factories.forEach((factory) => {
  factory.define(RosieFactory);
});

export const Factory = RosieFactory;
