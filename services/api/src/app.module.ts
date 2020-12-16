import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelloWorldModule } from './hello-world/hello-world.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => ({ debug: process.env.NODE_ENV !== 'production' })],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: configService.get<boolean>('debug'),
        playground: configService.get<boolean>('debug'),
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
