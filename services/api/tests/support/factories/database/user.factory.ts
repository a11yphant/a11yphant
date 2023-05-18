import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { USER } from "./constants";
import { UserData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<UserData>(USER)
    .attr("id", () => faker.string.uuid())
    .attr("displayName", () => faker.person.firstName())
    .attr("lastSeen", () => faker.date.recent({ days: 2 }));
}
