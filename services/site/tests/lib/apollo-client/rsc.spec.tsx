import { getApolloClient } from "app/lib/apollo-client/rsc";

jest.mock("next/headers", () => ({
  __esmodule: true,
  headers: () => ({ get: () => "a11yphant.com" }),
}));

jest.mock("@apollo/experimental-nextjs-app-support/rsc", () => ({
  registerApolloClient: (createClientFunction: any) => ({
    getClient: () => createClientFunction(),
  }),
}));

describe("apollo-client rsc", () => {
  it("registers a client", () => {
    const client = getApolloClient();
    expect(client).toBeDefined();
  });
});
