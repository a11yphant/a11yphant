import { AwsMessagingClient } from "@a11yphant/nestjs-aws-messaging";
import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";

import { SubmissionCheckCompleted } from "./submission-check-completed-event.interface";
import { SubmissionCreatedEvent } from "./submission-created-event.interface";

@Controller()
export class SubmissionController {
  constructor(private logger: Logger, @Inject(AwsMessagingClient) private clientProxy: ClientProxy) {}
  @EventPattern("submission.created")
  public async handleSubmissionEvent({ submission, rules }: SubmissionCreatedEvent): Promise<void> {
    this.logger.log(`Received submission.created for ${submission.id}`, SubmissionController.name);

    const submissionCheckedEvent: SubmissionCheckCompleted = {
      submissionId: submission.id,
      ruleCheckResults: rules.map((rule) => ({
        id: rule.id,
        status: "error",
      })),
    };

    await this.clientProxy.emit("submission.check-completed", submissionCheckedEvent);
  }
}
