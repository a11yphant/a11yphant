import { Challenge } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const ChallengeFactory = Factory.define<Challenge>("challenge-record")
  .attr("id", faker.datatype.uuid())
  .attr("slug", faker.lorem.slug())
  .attr("name", faker.lorem.words(3));
