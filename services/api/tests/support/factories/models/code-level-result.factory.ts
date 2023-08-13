import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { Result } from "@/submission/graphql/models/result.model";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

export const CodeLevelResultFactory = Factory.define<Result>(Result.name, Result)
  .attr("id", () => faker.string.uuid())
  .attr("status", ResultStatus.SUCCESS)
  .attr("submissionId", () => faker.string.uuid());
