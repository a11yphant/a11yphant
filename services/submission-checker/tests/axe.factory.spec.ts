import { createMock } from "@golevelup/nestjs-testing";
import { WebDriver } from "selenium-webdriver";

import { AxeFactory } from "@/axe.factory";

describe("axe factory", () => {
  it("can create an axe builder instance", () => {
    const factory = new AxeFactory();

    expect(factory.create(createMock<WebDriver>(), {})).toBeTruthy();
  });
});
