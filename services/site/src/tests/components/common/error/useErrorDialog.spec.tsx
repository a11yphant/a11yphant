import { cleanup } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { NetworkError, UnknownError } from "app/components/common/error/errorMessages";
import { ErrorDialogProvider, useErrorDialog, useErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { GraphQLError } from "graphql";
import React from "react";

const mockTitle = "Mock Title";

const mockErrorCode = "MOCK_ERROR_CODE";
const mockSpecificErrorMessage = "Mock specific error message";

const mockDefaultErrorMessage = "Mock default error message";

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

afterEach(cleanup);

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

  it("displays graphQLErrors if exist", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithGraphQLErrors);
    });

    expect(result.current.errorDialog.props.messages.length).toBe(2);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<UnknownError />);
    expect(result.current.errorDialog.props.messages[1]).toEqual(<UnknownError />);
  });

  it("displays networkError if exists", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithNetworkError);
    });

    expect(result.current.errorDialog.props.messages.length).toBe(1);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<NetworkError />);
  });

  it("displays graphQLErrors if graphQLErrors and networkError exist", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(mockErrorResponseWithGraphQLAndNetworkError);
    });

    expect(result.current.errorDialog.props.messages.length).toBe(2);
    expect(result.current.errorDialog.props.messages[0]).toEqual(<UnknownError />);
    expect(result.current.errorDialog.props.messages[1]).toEqual(<UnknownError />);
  });

  it("displays unknown error if no specific message or default message exists", async () => {
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

  it("displays default error message if no specific message exists", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(
        {
          graphQLErrors: [new GraphQLError("")],
          networkError: null,
        },
        {
          defaultMessage: mockDefaultErrorMessage,
        },
      );
    });

    expect(result.current.errorDialog.props.messages.length).toBe(1);
    expect(result.current.errorDialog.props.messages[0]).toBe(mockDefaultErrorMessage);
  });

  it("displays specific error message", async () => {
    const { result } = renderHook(() => useErrorDialog());

    await act(async () => {
      result.current.errorDialogApi.showApolloError(
        {
          graphQLErrors: [new GraphQLError(mockGraphQLErrorMessage1, undefined, undefined, undefined, undefined, undefined, { code: mockErrorCode })],
          networkError: null,
        },
        {
          defaultMessage: mockDefaultErrorMessage,
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
  it("showApolloError throws error if it is used outside ErrorDialogContext", (done) => {
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

  it("showApolloError doesn't throw error if it is used inside ErrorDialogContext", (done) => {
    const wrapper = ({ children }): React.ReactElement => <ErrorDialogProvider>{children}</ErrorDialogProvider>;
    const { result } = renderHook(() => useErrorDialogApi(), { wrapper });

    try {
      act(() => {
        result.current.showApolloError({ graphQLErrors: [], networkError: null });
      });
      done();
    } catch (err) {
      done(err);
    }
  });

  it("replace errorDialogApi of ErrorDialogProvider with useErrorDialog output", () => {
    const { result: errorDialogResult } = renderHook(() => useErrorDialog());

    const wrapper = ({ children }): React.ReactElement => <ErrorDialogProvider {...errorDialogResult.current}>{children}</ErrorDialogProvider>;
    const { result: apiResult } = renderHook(() => useErrorDialogApi(), { wrapper });

    expect(apiResult.current).toBe(errorDialogResult.current.errorDialogApi);
  });
});
