import { Module } from "@nestjs/common";

import { SubmissionModule } from "@/submission/submission.module";

import { PrismaModule } from "../prisma/prisma.module";
import { AnswerOptionService } from "./answer-option.service";
import { ChallengesArgs } from "./arg-types/challenges.args";
import { LevelByChallengeSlugAndIndexArgs } from "./arg-types/level-by-challenge-slug-and-index.args";
import { ChallengeResolver } from "./challenge.resolver";
import { ChallengeService } from "./challenge.service";
import { CodeLevelResolver } from "./code-level.resolver";
import { HintService } from "./hint.service";
import { LevelResolver } from "./level.resolver";
import { LevelService } from "./level.service";
import { QuizLevelResolver } from "./quiz-level.resolver";
import { RequirementResolver } from "./requirement.resolver";
import { RequirementService } from "./requirement.service";
import { RuleService } from "./rule.service";
import { TaskResolver } from "./task.resolver";
import { TaskService } from "./task.service";

@Module({
  imports: [PrismaModule, SubmissionModule],
  providers: [
    ChallengeResolver,
    ChallengesArgs,
    ChallengeService,
    CodeLevelResolver,
    LevelResolver,
    LevelService,
    LevelByChallengeSlugAndIndexArgs,
    RequirementResolver,
    RequirementService,
    HintService,
    RuleService,
    TaskResolver,
    TaskService,
    AnswerOptionService,
    QuizLevelResolver,
  ],
  exports: [LevelService, RequirementService, RuleService],
})
export class ChallengeModule {}
