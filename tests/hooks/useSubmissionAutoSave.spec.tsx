import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, renderHook } from "@testing-library/react";
import { CreateCodeLevelSubmissionDocument, UpdateCodeLevelSubmissionDocument } from "app/generated/graphql";
import { useSubmissionAutoSave } from "app/hooks/useSubmissionAutoSave";
import React from "react";

const defaultCode = {
  html: "html",
  css: "css",
  js: "js",
};

function createUpdateSubmissionMock(submissionId = "uuid", code = defaultCode): MockedResponse {
  return {
    request: {
      query: UpdateCodeLevelSubmissionDocument,
      variables: {
        submissionInput: {
          id: submissionId,
          ...code,
        },
      },
    },
    newData: jest.fn(() => ({
      data: {
        updateCodeLevelSubmission: {
          submission: {
            id: submissionId,
            ...code,
          },
        },
      },
    })),
  };
}

function createCreateSubmissionMock(levelId = "level-uuid", code = defaultCode, submissionId = "submission-uuid"): MockedResponse {
  return {
    request: {
      query: CreateCodeLevelSubmissionDocument,
      variables: {
        submissionInput: {
          levelId,
          ...code,
        },
      },
    },
    newData: jest.fn(() => ({
      data: {
        createCodeLevelSubmission: {
          submission: {
            id: submissionId,
            ...code,
          },
        },
      },
    })),
  };
}

function createDefaultApolloMock(): MockedResponse[] {
  return [createCreateSubmissionMock(), createUpdateSubmissionMock()];
}

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.clearAllTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe("submission auto save", () => {
  it("can set the submission id", () => {
    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={createDefaultApolloMock()}>{children}</MockedProvider>;
    const { result } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    act(() => {
      result.current.setSubmissionId("uuid");
    });

    expect(result.current.submissionId).toBe("uuid");
  });

  it("can set the submission code", () => {
    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={createDefaultApolloMock()}>{children}</MockedProvider>;
    const { result } = renderHook(() => useSubmissionAutoSave(), { wrapper });
    const code = {
      html: "html",
      css: "css",
      js: "js",
    };

    act(() => {
      result.current.setSubmissionCode(code);
    });

    expect(result.current.submissionCode).toEqual(code);
  });

  it("can update the submission", async () => {
    const id = "uuid";

    const mockUpdateRequest = createUpdateSubmissionMock(id);

    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={[mockUpdateRequest]}>{children}</MockedProvider>;
    const { result } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    await act(async () => {
      result.current.setLevelId(id);
      result.current.setSubmissionId(id);
      result.current.setSubmissionCode(defaultCode);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
        jest.runOnlyPendingTimers();
      });
    });

    await act(async () => {
      await jest.runOnlyPendingTimersAsync();
    });

    expect(mockUpdateRequest.newData).toHaveBeenCalled();
  });

  it("creates a new submission if no submission id is set", async () => {
    const levelId = "uuid";
    const submissionId = "submission-uuid";

    const mockCreateRequest = createCreateSubmissionMock(levelId, defaultCode, submissionId);
    const mockUpdateRequest = createUpdateSubmissionMock(submissionId);

    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={[mockCreateRequest, mockUpdateRequest]}>{children}</MockedProvider>;
    const { result } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    await act(async () => {
      result.current.setLevelId(levelId);
      result.current.setSubmissionCode(defaultCode);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
        jest.runOnlyPendingTimers();
      });
    });

    await act(async () => {
      await jest.runOnlyPendingTimersAsync();
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
        jest.runOnlyPendingTimers();
      });
    });

    expect(mockCreateRequest.newData).toHaveBeenCalled();
    expect(result.current.submissionId).toEqual(submissionId);
  });

  it("updates the submission after a delay", async () => {
    const levelId = "uuid";

    const mockRequest = createCreateSubmissionMock(levelId);

    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={[mockRequest]}>{children}</MockedProvider>;
    const { result } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    await act(async () => {
      result.current.setLevelId(levelId);
      result.current.setSubmissionCode(defaultCode);
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockRequest.newData).toHaveBeenCalled();
  });

  it("provides the loading state", async () => {
    const levelId = "uuid";

    const mockRequest = createCreateSubmissionMock(levelId);

    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={[mockRequest]}>{children}</MockedProvider>;
    const { result } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    await act(async () => {
      result.current.setLevelId(levelId);
      result.current.setSubmissionCode(defaultCode);
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });

    expect(result.current.loading).toBeTruthy();
  });
});
