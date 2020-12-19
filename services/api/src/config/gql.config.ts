import { registerAs } from '@nestjs/config';

export default registerAs('gql', () => ({
  debug: Boolean(+process.env.API_GRAPHQL_DEBUG) || false,
  playground: Boolean(+process.env.API_GRAPHQL_PLAYGROUND) || false,
}));
