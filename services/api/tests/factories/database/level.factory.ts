import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { ChallengeFactory } from "./challenge.factory";

export const LevelFactory = Factory.define<Prisma.LevelCreateArgs["data"]>("level-record")
  .attr("instructions", () => faker.lorem.paragraph())
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')")
  .option("withChallenge", false)
  .attr("challenge", ["withChallenge"], (withChallenge = false) => {
    if (!withChallenge) {
      return undefined;
    }

    const challenge: Prisma.ChallengeCreateNestedOneWithoutLevelsInput = {
      create: ChallengeFactory.build(),
    };

    return challenge;
  });
