import { execute, gql } from "@apollo/client";
import { MockLink } from "@apollo/client/testing";
import { MockApolloLink, MockedResponse } from "@apollo/client/utilities/testing/mocking/mockLink";
import { LocalErrorScopeApolloContext } from "app/components/common/error/ErrorScope";
import { useErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { createErrorLink } from "app/lib/apollo-client/create-error-link";

import { createTerminatingLink } from "./helpers";

const query = gql`
  query test {
    user {
      id
    }
  }
`;

jest.mock("app/components/common/error/useErrorDialog", () => ({
  useErrorDialogApi: () => ({
    showApolloError: jest.fn(),
  }),
}));

const mockedResponse: MockedResponse = {
  request: {
    query: query,
  },
  error: new Error("Ein Error"),
};

let mockLink: MockApolloLink;
beforeEach(() => {
  mockLink = new MockLink([mockedResponse]);
});

describe("create error link", () => {
  it("returns a link", (done) => {
    const errorDialogApi = useErrorDialogApi();

    const link = createErrorLink({ errorDialogApi }).concat(createTerminatingLink());

    execute(link, { query }).subscribe({
      complete: done,
      error: done.fail,
    });
  });

  it("opens errorDialog if error scope is global", (done) => {
    const errorDialogApi = useErrorDialogApi();

    // const link = createErrorLink({ errorDialogApi }).concat(createTerminatingLink());
    const link = createErrorLink({ errorDialogApi }).concat(mockLink);

    execute(link, { query }).subscribe({
      error: () => {
        try {
          expect(errorDialogApi.showApolloError).toHaveBeenCalledTimes(1);
          done();
        } catch (err) {
          done(err);
        }
      },
    });
  });

  it("doesn't open errorDialog if error scope is local", (done) => {
    const errorDialogApi = useErrorDialogApi();

    // const link = createErrorLink({ errorDialogApi }).concat(createTerminatingLink());
    const link = createErrorLink({ errorDialogApi }).concat(mockLink);

    execute(link, { query, context: LocalErrorScopeApolloContext }).subscribe({
      error: () => {
        try {
          expect(errorDialogApi.showApolloError).toHaveBeenCalledTimes(0);
          done();
        } catch (err) {
          done(err);
        }
      },
    });
  });
});
