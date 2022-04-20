import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";

import { BrowserService } from "./browser.service";
import { CheckSubmissionService } from "./check-submission.service";
import { SUBMISSIONS_CLIENT } from "./constants";
import { SubmissionCheckCompletedEvent } from "./submission-check-completed-event.interface";
import { SubmissionCreatedEvent } from "./submission-created-event.interface";

@Controller()
export class SubmissionController {
  constructor(
    private logger: Logger,
    @Inject(SUBMISSIONS_CLIENT) private clientProxy: ClientProxy,
    private submissionChecker: CheckSubmissionService,
    private browserService: BrowserService,
  ) {}

  @EventPattern("submission.created")
  public async handleSubmissionEvent({ submission, rules }: SubmissionCreatedEvent): Promise<void> {
    this.logger.log(`Received submission.created for ${submission.id}`, SubmissionController.name);

    const browser = await this.browserService.startSession();

    const result = await this.submissionChecker.check(submission, rules, browser);

    const submissionCheckedEvent: SubmissionCheckCompletedEvent = {
      submissionId: submission.id,
      result,
    };

    this.logger.log(`Check for submission ${submission.id} completed`, SubmissionController.name);

    await this.clientProxy.emit("submission.check-completed", submissionCheckedEvent).toPromise();
    await browser.quit();
  }
}
