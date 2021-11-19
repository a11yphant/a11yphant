import faker from "faker";
import { Factory } from "rosie";

import { User } from "@/user/models/user.model";

export const UserFactory = Factory.define<User>(User.name, User)
  .attr("id", () => faker.datatype.uuid())
  .attr("displayName", () => faker.name.firstName());
