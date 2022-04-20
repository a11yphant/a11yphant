import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ChallengeModule } from "@/challenge/challenge.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { SUBMISSIONS_CLIENT } from "./constants";
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
  imports: [
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: SUBMISSIONS_CLIENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>("messaging.rabbitmq-url")],
            queue: config.get<string>("messaging.publish-queue-name"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    forwardRef(() => ChallengeModule),
  ],
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
