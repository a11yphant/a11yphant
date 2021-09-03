import "module-alias/register";

import { NestFactory } from "@nestjs/core";
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from "@nestjs/graphql";
import { writeFileSync } from "fs";
import { printSchema } from "graphql";

import { ChallengeResolver } from "./challenge/challenge.resolver";
import { LevelResolver } from "./challenge/level.resolver";
import { RequirementResolver } from "./challenge/requirement.resolver";
import { TaskResolver } from "./challenge/task.resolver";
import { RequirementResultResolver } from "./submission/graphql/resolvers/requirement-result.resolver";
import { ResultResolver } from "./submission/graphql/resolvers/result.resolver";
import { SubmissionResolver } from "./submission/graphql/resolvers/submission.resolver";

const resolvers = [
  ChallengeResolver,
  TaskResolver,
  LevelResolver,
  SubmissionResolver,
  ResultResolver,
  RequirementResultResolver,
  RequirementResolver,
];

const scalars = [];

async function generateSchema(): Promise<void> {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers, scalars);
  writeFileSync("schema.gql", printSchema(schema));
}

generateSchema();
