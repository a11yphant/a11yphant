import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelloWorldModule } from './hello-world/hello-world.module';

import apiConfig from './config/api.config';
import gqlConfig from './config/gql.config';
import nodeConfig from './config/node.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, gqlConfig, nodeConfig],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: configService.get<boolean>('gql.debug'),
        playground: configService.get<boolean>('gql.playground'),
        autoSchemaFile: 'schema.gql',
        context: ({ req }) => ({ ...req }),
        cors: {
          credentials: true,
          origin: true,
        },
      }),
      inject: [ConfigService],
    }),
    HelloWorldModule,
  ],
})
export class AppModule {}
