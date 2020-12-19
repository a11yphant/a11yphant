import { NestFactory } from "@nestjs/core";
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from "@nestjs/graphql";
import { printSchema } from "graphql";
import { HelloWorldResolver } from "./hello-world/hello-world.resolver";
import { writeFileSync } from 'fs';

const resolvers = [
    HelloWorldResolver
]

const scalars = [

]

async function generateSchema() {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule);
    await app.init();

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
    const schema = await gqlSchemaFactory.create(resolvers, scalars);
    writeFileSync('schema.gql', printSchema(schema));
}

generateSchema();