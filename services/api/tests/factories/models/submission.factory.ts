import faker from "faker";
import { Factory } from "rosie";

import { Submission } from "@/submission/graphql/models/submission.model";

export const SubmissionFactory = Factory.define<Submission>(Submission.name, Submission)
  .attr("id", () => faker.datatype.uuid())
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')");
