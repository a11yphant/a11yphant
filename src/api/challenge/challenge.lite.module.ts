import { Module } from "@nestjs/common";

import { SubmissionModuleLite } from "@/submission/submission.lite.module";

import { PrismaModule } from "../prisma/prisma.module";
import { AnswerOptionService } from "./answer-option.service";
import { ChallengeService } from "./challenge.service";
import { HintService } from "./hint.service";
import { LevelService } from "./level.service";
import { RequirementService } from "./requirement.service";
import { RuleService } from "./rule.service";
import { TaskService } from "./task.service";

@Module({
  imports: [PrismaModule, SubmissionModuleLite],
  providers: [ChallengeService, LevelService, RequirementService, HintService, RuleService, TaskService, AnswerOptionService],
  exports: [LevelService, RequirementService, RuleService],
})
export class ChallengeModuleLite {}
