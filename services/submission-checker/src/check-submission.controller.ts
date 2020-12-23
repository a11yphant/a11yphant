import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CheckSubmissionService } from './check-submission.service';
import { SubmissionService } from './submission.service';

@Controller('check-submission')
export class CheckSubmissionController {
  constructor(
    private checkSubmissionService: CheckSubmissionService,
    private submissionService: SubmissionService,
  ) {}

  @Post(':id')
  async create(
    @Res() response: Response,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    this.submissionService.create({
      id,
      html: body.html,
      css: body.css,
      javascript: body.javascript,
    });
    const result = await this.checkSubmissionService.check(id);
    response.send(result);
  }
}
