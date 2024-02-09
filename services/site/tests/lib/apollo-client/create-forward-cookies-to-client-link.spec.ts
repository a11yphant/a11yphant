import { execute, gql } from "@apollo/client";
import { createForwardCookiesToClientLink, SetCookieFunction } from "app/lib/apollo-client/create-forward-cookies-to-client-link";

import { createTerminatingLink } from "./helpers";

const query = gql`
  query test {
    user {
      id
    }
  }
`;

describe("forward cookies to client link", () => {
  it("returns a link if no set cookie function is provided", (done) => {
    const link = createForwardCookiesToClientLink().concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("returns a link if a set cookie function is provided", (done) => {
    const setCookie = jest.fn() as SetCookieFunction;
    const link = createForwardCookiesToClientLink(setCookie).concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("sets the set cookie header in the response", (done) => {
    expect.assertions(1);

    const setCookie = jest.fn() as SetCookieFunction;
    const link = createForwardCookiesToClientLink(setCookie).concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: () => {
        expect(setCookie).toHaveBeenCalledWith(expect.objectContaining({ name: "a11yphant_session", value: "header-content" }));
        done();
      },
      error: done.fail,
    });
  });
});
