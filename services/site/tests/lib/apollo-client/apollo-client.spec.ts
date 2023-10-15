import { gql, InMemoryCache } from "@apollo/client";
import { renderHook } from "@testing-library/react";
import { createApolloClientSSR, initializeApollo, useApollo } from "app/lib/apollo-client";

const query = gql`
  query test {
    user {
      id
    }
  }
`;

const queryResult = { user: { __typename: "user", id: 4 } };

describe("apollo client", () => {
  describe("initialize apollo client", () => {
    it("returns an apollo client", () => {
      const client = initializeApollo("/graphql");

      expect(client).toBeTruthy();
    });

    it("returns a client with initial cache", () => {
      const cache = new InMemoryCache();
      cache.writeQuery({
        query,
        data: queryResult,
      });

      const client = initializeApollo("/graphql", cache.extract());

      expect(
        client.readQuery({
          query,
        }),
      ).toEqual(queryResult);
    });
  });

  describe("useApollo", () => {
    it("returns a client", () => {
      const { result } = renderHook(() => useApollo("/graphql", null));

      expect(result.current).toBeTruthy();
    });
  });

  describe("createApolloClient", () => {
    it("returns an apollo client", () => {
      const client = createApolloClientSSR("/graphql", { showApolloError: jest.fn() });

      expect(client).toBeTruthy();
    });
  });
});
