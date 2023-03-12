import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { CodeLevelSubmission } from "@/submission/graphql/models/code-level-submission.model";

export const CodeLevelSubmissionFactory = Factory.define<CodeLevelSubmission>(CodeLevelSubmission.name, CodeLevelSubmission)
  .attr("id", () => faker.datatype.uuid())
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')");
