import { act, renderHook } from "@testing-library/react-hooks";
import { NetworkError, UnknownError } from "app/components/common/error/errorMessages";
import { ErrorDialogProvider, useErrorDialog, useErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { GraphQLError } from "graphql";
import React from "react";
import ReactDOM from "react-dom";

const mockTitle = "Mock Title";

const mockErrorCode = "MOCK_ERROR_CODE";
const MockDefaultError = (): React.ReactElement => <div>Mock Default Error</div>;
const mockSpecificErrorMessage = "Mock specific error message";
const mockGraphQLErrorMessage1 = "Mock GraphQL Error Message 1";
const mockGraphQLErrorMessage2 = "Mock GraphQL Error Message 2";

const mockNetworkError = new Error("Network request failed");

const mockErrorResponseWithGraphQLErrors = {
  graphQLErrors: [new GraphQLError(mockGraphQLErrorMessage1), new GraphQLError(mockGraphQLErrorMessage2)],
  networkError: null,
};
const mockErrorResponseWithNetworkError = { graphQLErrors: [], networkError: mockNetworkError };
const mockErrorResponseWithGraphQLAndNetworkError = {
  graphQLErrors: [new GraphQLError(mockGraphQLErrorMessage1), new GraphQLError(mockGraphQLErrorMessage2)],
  networkError: mockNetworkError,
};
const mockErrorResponseWithGraphQLErrorsInsideNetworkError = {
  graphQLErrors: [],
  networkError: {
    name: "Network Error with GraphQL errors",
    message: "Network Error with GraphQL errors",
    result: { errors: [new GraphQLError(mockGraphQLErrorMessage1), new GraphQLError(mockGraphQLErrorMessage2)] },
  },
};

beforeAll(() => {
  ReactDOM.createPortal = jest.fn((element, node) => {
    return element as React.ReactPortal;
  });
});

describe("useErrorDialog", () => {
  it("returns errorDialog and errorDialogApi", () => {
    const { result } = renderHook(() => useErrorDialog());

    expect(result.current.errorDialog).toBeTruthy();
    expect(result.current.errorDialogApi).toBeTruthy();
  });

  it("opens errorDialog", async () => {
    const { result } = renderHook(() => useErrorDialog());

    expect(result.current.errorDialog.props.open).toBeFalsy();

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithGraphQLAndNetworkError, { title: mockTitle });
    });

    expect(result.current.errorDialog.props.title).toBe(mockTitle);
    expect(result.current.errorDialog.props.errorResponse).toEqual(mockErrorResponseWithGraphQLAndNetworkError);
    expect(result.current.errorDialog.props.messages.length).toBeGreaterThan(0);
    expect(typeof result.current.errorDialog.props.onClose).toBe("function");
    expect(result.current.errorDialog.props.open).toBeTruthy();
  });

  it("closes errorDialog", async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithGraphQLAndNetworkError);
    });

    expect(result.current.errorDialog.props.open).toBeTruthy();

    await act(async () => {
      result.current.errorDialog.props.onClose();
      jest.runOnlyPendingTimers();
    });

    expect(result.current.errorDialog.props.open).toBeFalsy();
    expect(result.current.errorDialog.props.errorResponse).toBe(undefined);
    expect(result.current.errorDialog.props.messages.length).toBe(0);
  });

  it("renders graphQLErrors if they exist", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithGraphQLErrors, { defaultMessage: <MockDefaultError /> });
    });

    expect(result.current.errorDialog.props.messages.length).toBe(2);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<MockDefaultError />);
    expect(result.current.errorDialog.props.messages[1]).toEqual(<MockDefaultError />);
  });

  it("renders networkError if they exists", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithNetworkError);
    });

    expect(result.current.errorDialog.props.messages.length).toBe(1);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<NetworkError />);
  });

  it("renders errors inside networkError.result.errors if they exist", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithGraphQLErrorsInsideNetworkError, { defaultMessage: <MockDefaultError /> });
    });

    expect(result.current.errorDialog.props.messages.length).toBe(2);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<MockDefaultError />);
    expect(result.current.errorDialog.props.messages[1]).toEqual(<MockDefaultError />);
  });

  it("renders graphQLErrors if `graphQLErrors` and `networkError` exist", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithGraphQLAndNetworkError, { defaultMessage: <MockDefaultError /> });
    });

    expect(result.current.errorDialog.props.messages.length).toBe(2);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<MockDefaultError />);
    expect(result.current.errorDialog.props.messages[1]).toEqual(<MockDefaultError />);
  });

  it("renders unknown error if no specific message or default message are present", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError({
        graphQLErrors: [new GraphQLError("")],
        networkError: null,
      });
    });

    expect(result.current.errorDialog.props.messages.length).toBe(1);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<UnknownError />);
  });

  it("renders default error message if no specific message exists", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(
        {
          graphQLErrors: [new GraphQLError("")],
          networkError: null,
        },
        {
          defaultMessage: <MockDefaultError />,
        },
      );
    });

    expect(result.current.errorDialog.props.messages.length).toBe(1);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<MockDefaultError />);
  });

  it("renders specific error message", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(
        {
          graphQLErrors: [new GraphQLError(mockGraphQLErrorMessage1, undefined, undefined, undefined, undefined, undefined, { code: mockErrorCode })],
          networkError: null,
        },
        {
          defaultMessage: <MockDefaultError />,
          specificMessages: {
            [mockErrorCode]: mockSpecificErrorMessage,
          },
        },
      );
    });

    expect(result.current.errorDialog.props.messages.length).toBe(1);
    expect(result.current.errorDialog.props.messages[0]).toBe(mockSpecificErrorMessage);
  });
});

describe("useErrorDialogApi", () => {
  it("showApolloError throws an error if it is used outside the `ErrorDialogContext`", (done) => {
    const { result } = renderHook(() => useErrorDialogApi());

    expect(result.current.showApolloError).toBeTruthy();
    try {
      result.current.showApolloError({ graphQLErrors: [], networkError: null });
      done("should throw error");
    } catch (err) {
      expect(err.message).toBe("Error Dialog used outside ErrorDialogContext");
      done();
    }
  });

  it("replace `errorDialogApi` of `ErrorDialogProvider` with `useErrorDialog` output", () => {
    const { result: errorDialogResult } = renderHook(() => useErrorDialog());

    const wrapper = ({ children }): React.ReactElement => <ErrorDialogProvider {...errorDialogResult.current}>{children}</ErrorDialogProvider>;
    const { result: apiResult } = renderHook(() => useErrorDialogApi(), { wrapper });

    expect(apiResult.current).toBe(errorDialogResult.current.errorDialogApi);
  });
});
