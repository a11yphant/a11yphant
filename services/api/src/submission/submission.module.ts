import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { forwardRef, Logger, Module } from "@nestjs/common";

import { ChallengeModule } from "@/challenge/challenge.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { RendererController } from "./controllers/renderer.controller";
import { CodeLevelResultResolver } from "./graphql/resolvers/code-level-result.resolver";
import { CodeLevelSubmissionResolver } from "./graphql/resolvers/code-level-submission.resolver";
import { QuizLevelSubmissionResolver } from "./graphql/resolvers/quiz-level-submission.resolver";
import { RequirementResultResolver } from "./graphql/resolvers/requirement-result.resolver";
import { SubmissionResolver } from "./graphql/resolvers/submission.resolver";
import { SubmissionController } from "./microservices/submission.controller";
import { CodeLevelResultService } from "./services/code-level-result.service";
import { CodeLevelSubmissionService } from "./services/code-level-submission.service";
import { QuizLevelSubmissionService } from "./services/quiz-level-submission.service";
import { RequirementResultService } from "./services/requirement-result.service";

@Module({
  imports: [PrismaModule, AwsMessagingModule, forwardRef(() => ChallengeModule)],
  controllers: [SubmissionController, RendererController],
  providers: [
    SubmissionResolver,
    CodeLevelSubmissionService,
    CodeLevelResultResolver,
    CodeLevelResultService,
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
