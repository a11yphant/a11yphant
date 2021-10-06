import "module-alias/register";

import { NestFactory } from "@nestjs/core";
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from "@nestjs/graphql";
import { writeFileSync } from "fs";
import { printSchema } from "graphql";

import { AuthenticationResolver } from "./authentication/authentication.resolver";
import { ChallengeResolver } from "./challenge/challenge.resolver";
import { CodeLevelResolver } from "./challenge/code-level.resolver";
import { LevelResolver } from "./challenge/level.resolver";
import { QuizLevelResolver } from "./challenge/quiz-level.resolver";
import { RequirementResolver } from "./challenge/requirement.resolver";
import { TaskResolver } from "./challenge/task.resolver";
import { CodeLevelSubmissionResolver } from "./submission/graphql/resolvers/code-level-submission.resolver";
import { QuizLevelSubmissionResolver } from "./submission/graphql/resolvers/quiz-level-submission.resolver";
import { RequirementResultResolver } from "./submission/graphql/resolvers/requirement-result.resolver";
import { ResultResolver } from "./submission/graphql/resolvers/result.resolver";
import { SubmissionResolver } from "./submission/graphql/resolvers/submission.resolver";
import { UserResolver } from "./user/user.resolver";

const resolvers = [
  AuthenticationResolver,
  ChallengeResolver,
  CodeLevelResolver,
  LevelResolver,
  RequirementResolver,
  RequirementResultResolver,
  ResultResolver,
  SubmissionResolver,
  TaskResolver,
  UserResolver,
  QuizLevelResolver,
  CodeLevelSubmissionResolver,
  QuizLevelSubmissionResolver,
];

const scalars = [];

export async function generateSchema(): Promise<void> {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers, scalars);
  writeFileSync("schema.gql", printSchema(schema));
}

// generate the schema only if the file is executed directly
if (require.main === module) {
  generateSchema();
}
