import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, renderHook } from "@testing-library/react-hooks";
import { CreateSubmissionDocument, UpdateSubmissionDocument } from "app/generated/graphql";
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
      query: UpdateSubmissionDocument,
      variables: {
        submissionInput: {
          id: submissionId,
          ...code,
        },
      },
    },
    newData: jest.fn(() => ({
      data: {
        updateSubmission: {
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
      query: CreateSubmissionDocument,
      variables: {
        submissionInput: {
          levelId,
          ...code,
        },
      },
    },
    newData: jest.fn(() => ({
      data: {
        createSubmission: {
          submission: {
            id: submissionId,
            ...code,
          },
        },
      },
    })),
  };
}

const defaultApolloMock = [createCreateSubmissionMock(), createUpdateSubmissionMock()];

describe("submission auto save", () => {
  it("can set the submission id", () => {
    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={defaultApolloMock}>{children}</MockedProvider>;
    const { result } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    act(() => {
      result.current.setSubmissionId("uuid");
    });

    expect(result.current.submissionId).toBe("uuid");
  });

  it("can set the submission code", () => {
    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={defaultApolloMock}>{children}</MockedProvider>;
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

    const mockRequest = createUpdateSubmissionMock(id);

    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={[mockRequest]}>{children}</MockedProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    await act(async () => {
      result.current.setSubmissionId(id);
      result.current.setSubmissionCode(defaultCode);
      await waitForNextUpdate();
      await result.current.updateSubmission();
    });

    expect(mockRequest.newData).toHaveBeenCalled();
  });

  it("creates a new submission if no submission id is set", async () => {
    const levelId = "uuid";
    const submissionId = "submission-uuid";

    const mockRequest = createCreateSubmissionMock(levelId, defaultCode, submissionId);

    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={[mockRequest]}>{children}</MockedProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    await act(async () => {
      result.current.setLevelId(levelId);
      result.current.setSubmissionCode(defaultCode);
      await waitForNextUpdate();
      await result.current.updateSubmission();
    });

    expect(mockRequest.newData).toHaveBeenCalled();
    expect(result.current.submissionId).toEqual(submissionId);
  });

  it("updates the submission after a delay", async () => {
    jest.useFakeTimers();
    const levelId = "uuid";

    const mockRequest = createCreateSubmissionMock(levelId);

    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={[mockRequest]}>{children}</MockedProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useSubmissionAutoSave(), { wrapper });

    await act(async () => {
      result.current.setLevelId(levelId);
      result.current.setSubmissionCode(defaultCode);
      await waitForNextUpdate();
    });

    jest.advanceTimersByTime(1000);
    await waitForNextUpdate();

    expect(mockRequest.newData).toHaveBeenCalled();
  });
});
