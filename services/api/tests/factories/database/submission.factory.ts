import { Prisma } from "@prisma/client";
import { Factory } from "rosie";

import { LevelFactory } from "./level.factory";

export const SubmissionFactory = Factory.define<Prisma.SubmissionCreateArgs["data"]>("submission-record")
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')")
  .attr("levelId", undefined)
  .option("createLevelIfMissing", true)
  .attr("level", ["levelId", "createLevelIfMissing"], (levelId: string, createLevelIfMissing: boolean) => {
    if (levelId || (!createLevelIfMissing && !levelId)) {
      return undefined;
    }

    const requirement: Prisma.LevelCreateNestedOneWithoutSubmissionsInput = {
      create: LevelFactory.build({}, { createSubmissionIfMissing: false }),
    };

    return requirement;
  });
