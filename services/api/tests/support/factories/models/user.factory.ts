import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { User } from "@/user/models/user.model";

export const UserFactory = Factory.define<User>(User.name, User)
  .attr("id", () => faker.datatype.uuid())
  .attr("displayName", () => faker.name.firstName())
  .attr("authId", () => faker.datatype.string(10))
  .attr("authProvider", () => "anonymous")
  .attr("verifiedAt", () => faker.date.past());
