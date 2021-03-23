import { NestFactory } from "@nestjs/core";
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from "@nestjs/graphql";
import { writeFileSync } from "fs";
import { printSchema } from "graphql";

import { ChallengeResolver } from "./challenge/challenge.resolver";
import { HintResolver } from "./challenge/hint.resolver";
import { LevelResolver } from "./challenge/level.resolver";
import { HelloWorldResolver } from "./hello-world/hello-world.resolver";

const resolvers = [HelloWorldResolver, ChallengeResolver, HintResolver, LevelResolver];

const scalars = [];

async function generateSchema(): Promise<void> {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers, scalars);
  writeFileSync("schema.gql", printSchema(schema));
}

generateSchema();
