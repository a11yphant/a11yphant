import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrowserService } from './browser.service';

@Injectable()
export class CheckSubmissionService {
  constructor(private config: ConfigService, private browser: BrowserService) {}

  public check(id: number): Promise<any> {
    const url = `${this.config.get<string>('submissionRenderer.baseUrl')}${id}`;
    return this.browser.runAxeChecks(url);
  }
}
