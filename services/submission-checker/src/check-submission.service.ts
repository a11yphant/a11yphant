import { Injectable } from '@nestjs/common';
import { BrowserService } from './browser.service';

@Injectable()
export class CheckSubmissionService {
  constructor(private browser: BrowserService) {}

  public async check(id: number): Promise<boolean> {
    await this.browser.runAxeChecks(`http://submission-renderer-url/${id}`);
    return true;
  }
}
