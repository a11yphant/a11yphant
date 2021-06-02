import { ApolloLink, execute, gql } from "@apollo/client";
import { createForwardCookiesToServerLink } from "app/lib/apollo-client/create-forward-cookies-to-server-link";
import { GetServerSidePropsContext } from "next";

import { createFakeObservable, createTerminatingLink } from "./helpers";

const query = gql`
  query test {
    user {
      id
    }
  }
`;

describe("forward cookies to server", () => {
  it("returns a link if no context is provided", (done) => {
    const link = createForwardCookiesToServerLink().concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("returns a link if a context is provided", (done) => {
    const context = { res: {}, req: {} } as unknown as GetServerSidePropsContext;
    const link = createForwardCookiesToServerLink(context).concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("sets the cookie header in the operation context", (done) => {
    expect.assertions(1);

    const context = { res: {}, req: { headers: { cookie: "cookie" } } } as unknown as GetServerSidePropsContext;
    const link = createForwardCookiesToServerLink(context).concat(
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
