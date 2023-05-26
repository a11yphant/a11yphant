import { Inject, Injectable, Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { CHECK_TO_CLASS_MAP } from "./check-to-class-map";
import { Check } from "./checks/check.interface";
import { CheckProviderNotFound as CheckProviderNotFoundException } from "./exceptions/CheckProviderNotFoundException";

type ClassType = { new (): any };

@Injectable()
export class CheckFactory {
  constructor(
    private logger: Logger,
    @Inject(CHECK_TO_CLASS_MAP) private checkToClassMap: Record<string, ClassType>,
    private moduleRef: ModuleRef,
  ) {}

  public get(checkName: string): Check | null {
    const className = this.checkToClassMap[checkName];

    if (!className) {
      this.logger.warn(`Could not get check class name for ${checkName}`, CheckFactory.name);
      return null;
    }

    try {
      return this.moduleRef.get<Check>(className);
    } catch {
      const error = new CheckProviderNotFoundException(checkName);
      this.logger.error(error.message, error.stack, CheckFactory.name);
      throw error;
    }
  }
}
