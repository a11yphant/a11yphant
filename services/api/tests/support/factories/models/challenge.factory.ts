import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { Challenge } from "@/challenge/models/challenge.model";

export const ChallengeFactory = Factory.define<Challenge>(Challenge.name, Challenge)
  .attr("id", () => faker.datatype.uuid())
  .attr("slug", () => faker.lorem.slug())
  .attr("name", () => faker.lorem.words(3));
