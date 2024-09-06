// taken from https://github.com/nest-modules/mailer/blob/main/lib/adapters/liquid.adapter.ts
// copied in to patch out a bug

import { MailerOptions, TemplateAdapter } from "@nestjs-modules/mailer";
import { Liquid } from "liquidjs";
import { get } from "lodash";
import * as path from "path";

export class LiquidAdapter implements TemplateAdapter {
  // here be the bug, if this is not initialized, the Object.assign in the constructor will fail
  private config: Partial<Liquid["options"]> = {};

  constructor(config?: Partial<Liquid["options"]>) {
    Object.assign(this.config, config);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public compile(mail: any, callback: any, mailerOptions: MailerOptions): void {
    const { context, template } = mail.data;

    const templateExt = path.extname(template) || ".liquid";
    const templateName = path.basename(template, path.extname(template));
    const templateDir = path.isAbsolute(template)
      ? path.dirname(template)
      : path.join(get(mailerOptions, "template.dir", ""), path.dirname(template));

    const engine = new Liquid({
      extname: templateExt,
      root: templateDir,
      ...this.config.globals,
    });

    engine
      .renderFile(templateName, context)
      .then((body) => {
        mail.data.html = body;
        return callback();
      })
      .catch((err) => {
        return callback(err);
      });
  }
}
