import { gql, InMemoryCache } from "@apollo/client";
import { renderHook } from "@testing-library/react-hooks";
import { initializeApollo, useApollo } from "app/lib/apollo-client";

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
    // TODO: was jetzt, return oder create?
    it("returns creates an apollo client", () => {
      const client = initializeApollo();

      expect(client).toBeTruthy();
    });

    it("returns a client with initial cache", () => {
      const cache = new InMemoryCache();
      cache.writeQuery({
        query,
        data: queryResult,
      });

      const client = initializeApollo(cache.extract());

      expect(
        client.readQuery({
          query,
        }),
      ).toEqual(queryResult);
    });
  });
});

describe("useApollo", () => {
  it("returns a client", () => {
    const { result } = renderHook(() => useApollo(null));

    expect(result.current).toBeTruthy();
  });
});
