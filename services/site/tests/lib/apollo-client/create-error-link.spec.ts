import { execute, gql } from "@apollo/client";
import { MockedResponse, MockLink } from "@apollo/client/testing";
import { LocalErrorScopeApolloContext } from "app/components/common/error/ErrorScope";
import { useErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { createErrorLink } from "app/lib/apollo-client/create-error-link";

import { createTerminatingLink } from "./helpers";

jest.mock("app/components/common/error/useErrorDialog", () => ({
  useErrorDialogApi: () => ({
    showApolloError: jest.fn(),
  }),
}));

const query = gql`
  query test {
    user {
      id
    }
  }
`;

const mockedResponse: MockedResponse = {
  request: {
    query: query,
  },
  error: new Error("An Error"),
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("create error link", () => {
  let mockLink: MockLink;

  beforeEach(() => {
    mockLink = new MockLink([mockedResponse]);
  });

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
