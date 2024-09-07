import { forwardRef, Logger, Module } from "@nestjs/common";

import { ChallengeModuleLite } from "@/challenge/challenge.lite.module";
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
  ElementHasMinimumDimension,
  ElementNotContainsText,
  ElementNotExists,
  HtmlIsValid,
  MarginBetweenElementsGreaterThanOrEqual,
} from "./checks/base-checks";
import { CheckFactory } from "./checks/check.factory";
import { CHECK_TO_CLASS_MAP, checkToClassMap } from "./checks/check-to-class-map";
import { CheckSubmissionService } from "./services/check-submission.service";
import { CodeLevelResultService } from "./services/code-level-result.service";
import { CodeLevelSubmissionService } from "./services/code-level-submission.service";
import { QuizLevelSubmissionService } from "./services/quiz-level-submission.service";
import { RequirementResultService } from "./services/requirement-result.service";

@Module({
  imports: [PrismaModule, forwardRef(() => ChallengeModuleLite)],
  providers: [
    CodeLevelSubmissionService,
    CodeLevelResultService,
    RequirementResultService,
    Logger,
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
    ElementHasMinimumDimension,
    HtmlIsValid,
    MarginBetweenElementsGreaterThanOrEqual,
    ...buildCheckProviders(AVAILABLE_AXE_CHECKS),
  ],
  exports: [CodeLevelSubmissionService],
})
export class SubmissionModuleLite {}
