import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { RequirementStatus } from "@/challenge/enums/requirement-status.enum";

import { ResultStatus } from "../graphql/models/result-status.enum";
import { SubmissionCheckCompletedEvent } from "../interfaces/submission-check-completed-event.interface";
import { CodeLevelResultService } from "../services/code-level-result.service";
import { RequirementResultService } from "../services/requirement-result.service";

@Controller()
export class SubmissionController {
  constructor(
    private logger: Logger,
    private resultService: CodeLevelResultService,
    private requirementResultService: RequirementResultService,
  ) {}
  @EventPattern("submission.check-completed")
  public async handleSubmissionEvent(event: SubmissionCheckCompletedEvent): Promise<void> {
    this.logger.log(`Received submission.check-completed for ${event.submissionId}`, SubmissionController.name);

    const result = await this.resultService.findOneForSubmission(event.submissionId);
    await this.resultService.update(result.id, {
      status: this.getSubmissionStatus(event),
    });

    for (const checkResult of event.result.ruleCheckResults) {
      await this.requirementResultService.create(result.id, checkResult.id, this.getRequirementStatus(checkResult.status));
    }
  }

  private getRequirementStatus(status: string): RequirementStatus {
    switch (status) {
      case "success":
        return RequirementStatus.SUCCESS;
      case "failed":
        return RequirementStatus.FAIL;
      case "error":
        return RequirementStatus.ERROR;
      default:
        this.logger.error(`The result contained the unknown status ${status}`);
        return RequirementStatus.ERROR;
    }
  }

  private getSubmissionStatus(event: SubmissionCheckCompletedEvent): ResultStatus {
    if (event.result.ruleCheckResults.filter((result) => this.getRequirementStatus(result.status) === RequirementStatus.FAIL).length > 0) {
      return ResultStatus.FAIL;
    }

    if (event.result.ruleCheckResults.filter((result) => this.getRequirementStatus(result.status) === RequirementStatus.ERROR).length > 0) {
      return ResultStatus.ERROR;
    }

    return ResultStatus.SUCCESS;
  }
}
