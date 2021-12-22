import { execute, gql } from "@apollo/client";
import { createForwardCookiesToClientLink } from "app/lib/apollo-client/create-forward-cookies-to-client-link";
import { GetServerSidePropsContext } from "next";

import { createTerminatingLink } from "./helpers";

const query = gql`
  query test {
    user {
      id
    }
  }
`;

describe("forward cookies to client link", () => {
  it("returns a link if no context is provided", (done) => {
    const link = createForwardCookiesToClientLink().concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("returns a link if a context is provided", (done) => {
    const context = { res: { setHeader: jest.fn() }, req: {} } as unknown as GetServerSidePropsContext;
    const link = createForwardCookiesToClientLink(context).concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("sets the set cookie header in the response", (done) => {
    expect.assertions(1);

    const setHeader = jest.fn();
    const context = { res: { setHeader }, req: {} } as unknown as GetServerSidePropsContext;
    const link = createForwardCookiesToClientLink(context).concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: () => {
        expect(setHeader).toHaveBeenCalledWith("Set-Cookie", expect.any(String));
        done();
      },
      error: done.fail,
    });
  });
});
