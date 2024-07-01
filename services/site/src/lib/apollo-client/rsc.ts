import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { createApolloClientRSC } from "app/lib/apollo-client/create-apollo-client-rsc";
import { getConfig } from "app/lib/config/rsc";
import { headers } from "next/headers";

import { GetCookieHeaderFunction } from "./create-forward-cookies-to-server-link";

export const { getClient: getApolloClient } = registerApolloClient(() => {
  const getCookieHeader: GetCookieHeaderFunction = () => {
    const c = headers().get("cookie");
    console.log({ cookies: c });
    return c;
  };

  return createApolloClientRSC(getConfig(headers().get("host")).graphqlEndpointPath, getCookieHeader);
});
