import { Controller, Get, NotFoundException, Param } from "@nestjs/common";

import { CodeLevelSubmissionService } from "../services/code-level-submission.service";

@Controller("render")
export class RendererController {
  constructor(private submissionService: CodeLevelSubmissionService) {}

  @Get(":id")
  async show(@Param("id") id: string): Promise<string> {
    const submission = await this.submissionService.findOne(id);

    if (!submission) {
      throw new NotFoundException();
    }

    return submission.html;
  }
}
