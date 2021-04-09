import { AwsMessagingClient } from "@a11y-challenges/nestjs-aws-messaging";
import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";

import { CheckSubmissionService } from "./check-submission.service";
import { SubmissionCheckCompletedEvent } from "./submission-check-completed-event.interface";
import { SubmissionCreatedEvent } from "./submission-created-event.interface";

@Controller()
export class SubmissionController {
  constructor(
    private logger: Logger,
    @Inject(AwsMessagingClient) private clientProxy: ClientProxy,
    private submissionChecker: CheckSubmissionService,
  ) {}
  @EventPattern("submission.created")
  public async handleSubmissionEvent({ submission, rules }: SubmissionCreatedEvent): Promise<void> {
    this.logger.log(`Received submission.created for ${submission.id}`, SubmissionController.name);

    const result = await this.submissionChecker.check(submission, rules);

    const submissionCheckedEvent: SubmissionCheckCompletedEvent = {
      submissionId: submission.id,
      result,
    };

    await this.clientProxy.emit("submission.check-completed", submissionCheckedEvent);
  }
}
