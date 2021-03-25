import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { SubmissionCreatedEvent } from "./submission-created-event.interface";

@Controller()
export class SubmissionController {
  constructor(private logger: Logger) {}
  @EventPattern("submission.created")
  public handleSubmissionEvent({ submission }: SubmissionCreatedEvent): void {
    this.logger.log(`Received submission.created for ${submission.id}`, SubmissionController.name);
  }
}
