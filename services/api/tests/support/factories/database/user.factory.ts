import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { USER } from "./constants";
import { UserData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<UserData>(USER)
    .attr("id", () => faker.datatype.uuid())
    .attr("displayName", () => faker.name.firstName())
    .attr("lastSeen", () => faker.date.recent(2));
}
