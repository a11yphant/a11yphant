import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrowserService } from './browser.service';

@Injectable()
export class CheckSubmissionService {
  constructor(private config: ConfigService, private browser: BrowserService) {}

  public async check(id: number): Promise<boolean> {
    const url = `${this.config.get<string>('submissionRenderer.baseUrl')}${id}`;
    await this.browser.runAxeChecks(url);
    return true;
  }
}
