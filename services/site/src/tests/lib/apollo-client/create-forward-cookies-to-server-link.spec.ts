import { ApolloLink, execute, gql } from "@apollo/client";
import { createForwardCookiesToServerLink } from "app/lib/apollo-client/create-forward-cookies-to-server-link";
import { GetServerSidePropsContext } from "next";

const query = gql`
  query test {
    user {
      id
    }
  }
`;

describe("forward cookies to server", () => {
  it("returns a link if no context is provided", () => {
    expect.assertions(1);

    const finalLink = jest.fn();
    const link = createForwardCookiesToServerLink().concat(
      new ApolloLink(() => {
        finalLink();
        return null;
      }),
    );

    execute(link, { query }).subscribe(jest.fn());
    expect(finalLink).toHaveBeenCalled();
  });

  it("returns a link if a context is provided", () => {
    expect.assertions(1);

    const finalLink = jest.fn();
    const context = { res: {}, req: {} } as unknown as GetServerSidePropsContext;
    const link = createForwardCookiesToServerLink(context).concat(
      new ApolloLink(() => {
        finalLink();
        return null;
      }),
    );

    execute(link, { query }).subscribe(jest.fn());
    expect(finalLink).toHaveBeenCalled();
  });

  it("sets the cookie header in the operation context", () => {
    expect.assertions(1);

    const context = { res: {}, req: { headers: { cookie: "cookie" } } } as unknown as GetServerSidePropsContext;
    const link = createForwardCookiesToServerLink(context).concat(
      new ApolloLink((operation) => {
        expect(operation.getContext()?.headers?.cookie).toEqual("cookie");
        return null;
      }),
    );

    execute(link, { query }).subscribe(jest.fn());
  });
});
