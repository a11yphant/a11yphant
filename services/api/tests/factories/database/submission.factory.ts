import { Submission } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const SubmissionFactory = Factory.define<Submission>("submission-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')")
  .attr("levelId", () => faker.datatype.uuid());
