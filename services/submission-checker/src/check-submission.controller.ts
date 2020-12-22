import { Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CheckSubmissionService } from './check-submission.service';

@Controller('check-submission')
export class CheckSubmissionController {
  constructor(private checkSubmissionService: CheckSubmissionService) {}

  @Post(':id')
  async create(@Res() response: Response, @Param('id') id: number) {
    const result = await this.checkSubmissionService.check(id);
    response.send(result);
  }
}
