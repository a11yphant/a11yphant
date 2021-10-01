import { Controller, Get, NotFoundException, Param } from "@nestjs/common";

import { SubmissionService } from "../services/submission.service";

@Controller("render")
export class RendererController {
  constructor(private submissionService: SubmissionService) {}

  @Get(":id")
  async show(@Param("id") id: string): Promise<string> {
    const submission = await this.submissionService.findOne(id);

    if (!submission) {
      throw new NotFoundException();
    }

    return submission.html;
  }
}
