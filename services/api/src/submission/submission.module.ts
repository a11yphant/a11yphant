import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { Logger, Module } from "@nestjs/common";

import { ChallengeModule } from "../challenge/challenge.module";
import { PrismaModule } from "../prisma/prisma.module";
import { RendererController } from "./renderer.controller";
import { RequirementResultResolver } from "./requirement-result.resolver";
import { RequirementResultService } from "./requirement-result.service";
import { ResultResolver } from "./result.resolver";
import { ResultService } from "./result.service";
import { SubmissionController } from "./submission.controller";
import { SubmissionResolver } from "./submission.resolver";
import { SubmissionService } from "./submission.service";

@Module({
  imports: [PrismaModule, AwsMessagingModule, ChallengeModule],
  controllers: [SubmissionController, RendererController],
  providers: [SubmissionResolver, SubmissionService, ResultResolver, ResultService, RequirementResultResolver, RequirementResultService, Logger],
})
export class SubmissionModule {}
