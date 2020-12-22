import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('render')
export class RendererController {
  @Get(':id')
  show(@Res() response: Response) {
    response.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>Test</title>
                </head>
                <body>
                    Insert  snippet here
                </body>
            </html>
        `);
  }
}
