import { User } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const HintFactory = Factory.define<User>("user-record").attr("id", () => faker.datatype.uuid());
