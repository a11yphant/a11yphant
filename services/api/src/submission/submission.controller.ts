import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { SubmissionCheckCompletedEvent } from "./submission-check-completed-event.interface";

@Controller()
export class SubmissionController {
  constructor(private logger: Logger) {}
  @EventPattern("submission.check-completed")
  public async handleSubmissionEvent(event: SubmissionCheckCompletedEvent): Promise<void> {
    this.logger.log(`Received submission.check-completed for ${event.submissionId}`, SubmissionController.name);
    this.logger.log(event);
  }
}
