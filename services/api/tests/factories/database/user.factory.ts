import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const UserFactory = Factory.define<Prisma.UserCreateArgs["data"]>("user-record").attr("id", () => faker.datatype.uuid());
