import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { forwardRef, Logger, Module } from "@nestjs/common";

import { ChallengeModule } from "@/challenge/challenge.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { RendererController } from "./controllers/renderer.controller";
import { CodeLevelSubmissionResolver } from "./graphql/resolvers/code-level-submission.resolver";
import { QuizLevelSubmissionResolver } from "./graphql/resolvers/quiz-level-submission.resolver";
import { RequirementResultResolver } from "./graphql/resolvers/requirement-result.resolver";
import { ResultResolver } from "./graphql/resolvers/result.resolver";
import { SubmissionResolver } from "./graphql/resolvers/submission.resolver";
import { SubmissionController } from "./microservices/submission.controller";
import { CodeLevelSubmissionService } from "./services/code-level-submission.service";
import { QuizLevelSubmissionService } from "./services/quiz-level-submission.service";
import { RequirementResultService } from "./services/requirement-result.service";
import { ResultService } from "./services/result.service";

@Module({
  imports: [PrismaModule, AwsMessagingModule, forwardRef(() => ChallengeModule)],
  controllers: [SubmissionController, RendererController],
  providers: [
    SubmissionResolver,
    CodeLevelSubmissionService,
    ResultResolver,
    ResultService,
    RequirementResultResolver,
    RequirementResultService,
    Logger,
    CodeLevelSubmissionResolver,
    QuizLevelSubmissionResolver,
    QuizLevelSubmissionService,
  ],
  exports: [CodeLevelSubmissionService],
})
export class SubmissionModule {}
