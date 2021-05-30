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
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SITE_GRAPHQL_ENDPOINT = "https://here-is-the-api.com/graphql";
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_SITE_GRAPHQL_ENDPOINT = undefined;
  });

  describe("initialize apollo client", () => {
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
      ).toBeTruthy();
    });
  });
});

describe("useApollo", () => {
  it("returns a client", () => {
    const { result } = renderHook(() => useApollo(null));

    expect(result.current).toBeTruthy();
  });
});
