/**
 * @jest-environment node
 */

import { createUserWithSessionCookie } from "@tests/support/authentication";
import { CODE_LEVEL, CODE_LEVEL_SUBMISSION, CodeLevelData, CodeLevelSubmissionData, Factory } from "@tests/support/factories/database";
import { useDatabase, useTestingApp } from "@tests/support/helpers";
import gql from "graphql-tag";

import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

describe("code level", () => {
  jest.setTimeout(15000);
  const { getPrismaService } = useDatabase();
  const { getGraphQlClient, getApp } = useTestingApp();

  it("can create a submission for a user", async () => {
    const app = getApp();
    const prisma = getPrismaService();

    const { cookie, user } = await createUserWithSessionCookie(prisma, app);

    const codeLevel = await prisma.codeLevel.create({
      data: Factory.build<CodeLevelData>(CODE_LEVEL),
    });

    const graphqlClient = getGraphQlClient({ authCookie: cookie });
    const { data } = await graphqlClient.mutate({
      mutation: gql`
        mutation createCodeLevelSubmission($submissionInput: CreateCodeLevelSubmissionInput!) {
          createCodeLevelSubmission(submissionInput: $submissionInput) {
            submission {
              id
              html
              css
              js
            }
          }
        }
      `,
      variables: {
        submissionInput: {
          levelId: codeLevel.id,
          html: "",
          css: "",
          js: "",
        },
      },
    });

    const databaseEntry = await prisma.codeLevelSubmission.findFirst({
      where: { levelId: codeLevel.id, userId: user.id },
    });

    expect(data.createCodeLevelSubmission.submission.id).toBeTruthy();
    expect(databaseEntry).toBeTruthy();
  });

  it("can request a check for a submission", async () => {
    const app = getApp();
    const prisma = getPrismaService();

    const { cookie, user } = await createUserWithSessionCookie(prisma, app);

    const submission = await prisma.codeLevelSubmission.create({
      data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { user: { connect: { id: user.id } } }),
    });

    const graphqlClient = getGraphQlClient({ authCookie: cookie });
    const { data } = await graphqlClient.mutate({
      mutation: gql`
        mutation requestCodeLevelCheck($requestCheckInput: RequestCodeLevelCheckInput!) {
          requestCodeLevelCheck(requestCheckInput: $requestCheckInput) {
            result {
              id
            }
          }
        }
      `,
      variables: {
        requestCheckInput: {
          submissionId: submission.id,
        },
      },
    });

    const databaseEntry = await prisma.codeLevelResult.findFirst({
      where: { submissionId: submission.id },
    });

    expect(data.requestCodeLevelCheck.result.id).toBeTruthy();
    expect(databaseEntry).toBeTruthy();
  });

  it("can fetch the result for a submission", async () => {
    const app = getApp();
    const prisma = getPrismaService();

    const { cookie, user } = await createUserWithSessionCookie(prisma, app);

    const submission = await prisma.codeLevelSubmission.create({
      data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
        user: { connect: { id: user.id } },
        result: {
          create: {
            status: ResultStatus.PENDING,
          },
        },
      }),
    });

    const graphqlClient = getGraphQlClient({ authCookie: cookie });
    const { data } = await graphqlClient.query({
      query: gql`
        query resultForSubmission($id: String!) {
          resultForSubmission(submissionId: $id) {
            id
            status
          }
        }
      `,
      variables: {
        id: submission.id,
      },
    });

    expect(data.resultForSubmission.status).toBe("PENDING");
  });
});
