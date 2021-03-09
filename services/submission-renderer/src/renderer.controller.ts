import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { SubmissionService } from 'src/submission.service';

@Controller('render')
export class RendererController {
  constructor(private submissionService: SubmissionService) {}

  @Get(':id')
  show(@Res() response: Response, @Param('id') id: number): void {
    const submission = this.submissionService.find(id);
    response.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>Test</title>
                    <style>
                        ${submission.css}
                    </style>
                </head>
                <body>
                    ${submission.html}
                    <script>
                        ${submission.javascript}
                    </script>
                </body>
            </html>
        `);
  }
}
