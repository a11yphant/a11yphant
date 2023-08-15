import { forwardRef, Logger, Module } from "@nestjs/common";

import { ChallengeModule } from "@/challenge/challenge.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { AVAILABLE_AXE_CHECKS, buildCheckProviders } from "./checks/axe-checks";
import {
  ColorContrastGreaterThanOrEqual,
  DocumentLanguageIsSpecified,
  DocumentStartsWithHtml5Doctype,
  ElementContainsText,
  ElementExists,
  ElementHasCssPropertyValue,
  ElementHasCssPropertyValueGreaterThan,
  ElementNotContainsText,
  ElementNotExists,
  HtmlIsValid,
} from "./checks/base-checks";
import { CheckFactory } from "./checks/check.factory";
import { CHECK_TO_CLASS_MAP, checkToClassMap } from "./checks/check-to-class-map";
import { RendererController } from "./controllers/renderer.controller";
import { CodeLevelResultResolver } from "./graphql/resolvers/code-level-result.resolver";
import { CodeLevelSubmissionResolver } from "./graphql/resolvers/code-level-submission.resolver";
import { QuizLevelSubmissionResolver } from "./graphql/resolvers/quiz-level-submission.resolver";
import { RequirementResultResolver } from "./graphql/resolvers/requirement-result.resolver";
import { SubmissionResolver } from "./graphql/resolvers/submission.resolver";
import { CheckSubmissionService } from "./services/check-submission.service";
import { CodeLevelResultService } from "./services/code-level-result.service";
import { CodeLevelSubmissionService } from "./services/code-level-submission.service";
import { QuizLevelSubmissionService } from "./services/quiz-level-submission.service";
import { RequirementResultService } from "./services/requirement-result.service";

@Module({
  imports: [PrismaModule, forwardRef(() => ChallengeModule)],
  controllers: [RendererController],
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
    CheckSubmissionService,
    CheckFactory,
    { provide: CHECK_TO_CLASS_MAP, useValue: checkToClassMap },
    { provide: "fetch", useValue: fetch },
    ColorContrastGreaterThanOrEqual,
    DocumentLanguageIsSpecified,
    DocumentStartsWithHtml5Doctype,
    ElementContainsText,
    ElementExists,
    ElementHasCssPropertyValue,
    ElementHasCssPropertyValueGreaterThan,
    ElementNotContainsText,
    ElementNotExists,
    HtmlIsValid,
    ...buildCheckProviders(AVAILABLE_AXE_CHECKS),
  ],
  exports: [CodeLevelSubmissionService],
})
export class SubmissionModule {}
