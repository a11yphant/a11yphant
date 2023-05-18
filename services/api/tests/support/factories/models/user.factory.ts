import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { User } from "@/user/models/user.model";

export const UserFactory = Factory.define<User>(User.name, User)
  .attr("id", () => faker.string.uuid())
  .attr("displayName", () => faker.person.firstName())
  .attr("authId", () => faker.string.sample(10))
  .attr("authProvider", () => "anonymous")
  .attr("verifiedAt", () => faker.date.past());
