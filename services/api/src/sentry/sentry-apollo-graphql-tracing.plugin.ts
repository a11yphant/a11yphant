import { ApolloServerPlugin, GraphQLRequestListener } from "apollo-server-plugin-base";

export const SentryApolloGraphQLTracingPlugin: ApolloServerPlugin<any> = {
  async requestDidStart({ request, context }): Promise<GraphQLRequestListener> {
    if (request.operationName) {
      // set the transaction Name if we have named queries
      context.transaction.setName(request.operationName);
    }
    return {
      async willSendResponse({ context }) {
        // hook for transaction finished
        context.transaction.finish();
      },
      async executionDidStart() {
        return {
          willResolveField({ context, info }) {
            // hook for each new resolver
            const span = context.transaction.startChild({
              op: "resolver",
              description: `${info.parentType.name}.${info.fieldName}`,
            });
            return () => {
              // this will execute once the resolver is finished
              span.finish();
            };
          },
        };
      },
    };
  },
};
