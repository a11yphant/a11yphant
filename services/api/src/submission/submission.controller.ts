import { AwsMessagingClient } from "@a11y-challenges/nestjs-aws-messaging";
import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";

import { SubmissionCheckCompleted } from "./submission-check-completed-event.interface";

@Controller()
export class SubmissionController {
  constructor(private logger: Logger, @Inject(AwsMessagingClient) private clientProxy: ClientProxy) {}
  @EventPattern("submission.check-completed")
  public async handleSubmissionEvent(event: SubmissionCheckCompleted): Promise<void> {
    this.logger.log(`Received submission.check-completed for ${event.submissionId}`, SubmissionController.name);
  }
}
