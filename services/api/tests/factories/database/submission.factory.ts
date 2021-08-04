import { Prisma } from "@prisma/client";
import { Factory } from "rosie";

import { buildOneOf } from "./helpers";
import { LevelFactory } from "./level.factory";

export const SubmissionFactory = Factory.define<Prisma.SubmissionCreateArgs["data"]>("submission-record")
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')")
  .attr("levelId", undefined)
  .option("createLevelIfMissing", true)
  .attr("level", ["levelId", "createLevelIfMissing"], buildOneOf<typeof LevelFactory>(LevelFactory, {}, { createSubmissionIfMissing: false }));
