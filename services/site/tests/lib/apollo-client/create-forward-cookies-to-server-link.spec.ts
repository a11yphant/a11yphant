import { ApolloLink, execute, gql } from "@apollo/client";
import { createForwardCookiesToServerLink, GetCookieHeaderFunction } from "app/lib/apollo-client/create-forward-cookies-to-server-link";

import { createFakeObservable, createTerminatingLink } from "./helpers";

const query = gql`
  query test {
    user {
      id
    }
  }
`;

describe("forward cookies to server", () => {
  it("returns a link if no get cookie header function is provided", (done) => {
    const link = createForwardCookiesToServerLink().concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("returns a link if a get cookie header function is provided", (done) => {
    const getCookieHeader = jest.fn() as GetCookieHeaderFunction;
    const link = createForwardCookiesToServerLink(getCookieHeader).concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("sets the cookie header in the operation context", (done) => {
    expect.assertions(1);

    const getCookieHeader = jest.fn().mockReturnValue("cookie") as GetCookieHeaderFunction;
    const link = createForwardCookiesToServerLink(getCookieHeader).concat(
      new ApolloLink((operation) => {
        expect(operation.getContext()?.headers?.cookie).toEqual("cookie");

        return createFakeObservable();
      }),
    );

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });
});
