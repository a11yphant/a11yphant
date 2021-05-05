import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { RuleStatus } from "../challenge/enums/rule-status.enum";
import { ResultStatus } from "./models/result-status.enum";
import { RequirementResultService } from "./requirement-result.service";
import { ResultService } from "./result.service";
import { SubmissionCheckCompletedEvent } from "./submission-check-completed-event.interface";

@Controller()
export class SubmissionController {
  constructor(private logger: Logger, private resultService: ResultService, private requirementResultService: RequirementResultService) {}
  @EventPattern("submission.check-completed")
  public async handleSubmissionEvent(event: SubmissionCheckCompletedEvent): Promise<void> {
    this.logger.log(`Received submission.check-completed for ${event.submissionId}`, SubmissionController.name);

    const result = await this.resultService.findOneForSubmission(event.submissionId);
    await this.resultService.update(result.id, {
      status: this.getSubmissionStatus(event),
    });

    for (const checkResult of event.result.ruleCheckResults) {
      await this.requirementResultService.create(result.id, checkResult.id, this.getRuleStatus(checkResult.status));
    }
  }

  private getRuleStatus(status: string): RuleStatus {
    switch (status) {
      case "success":
        return RuleStatus.SUCCESS;
      case "failed":
        return RuleStatus.FAIL;
      case "error":
        return RuleStatus.ERROR;
      default:
        this.logger.error(`The result contained the unknown status ${status}`);
        return RuleStatus.ERROR;
    }
  }

  private getSubmissionStatus(event: SubmissionCheckCompletedEvent): ResultStatus {
    if (event.result.ruleCheckResults.filter((result) => this.getRuleStatus(result.status) === RuleStatus.FAIL).length > 0) {
      return ResultStatus.FAIL;
    }

    if (event.result.ruleCheckResults.filter((result) => this.getRuleStatus(result.status) === RuleStatus.ERROR).length > 0) {
      return ResultStatus.ERROR;
    }

    return ResultStatus.SUCCESS;
  }
}
