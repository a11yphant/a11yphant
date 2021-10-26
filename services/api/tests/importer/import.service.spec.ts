import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";
import faker from "faker";
import mock from "mock-fs";
import { join } from "path";

import { Challenge, CodeLevel, QuizLevel } from "@/importer/challenge.interface";
import { ImportService } from "@/importer/import.service";
import { Rule } from "@/importer/rule.interface";
import { YamlReaderService } from "@/importer/yaml-reader.service";
import { PrismaService } from "@/prisma/prisma.service";

describe("import service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  const path = join(__dirname, "test-challenges");

  afterEach(() => {
    mock.restore();
  });

  beforeEach(() => {
    mock({
      [path]: {
        "challenge-1.yml": "",
        "challenge-2.yml": "",
        "asdf.png": "",
        ".": {},
      },
    });
  });

  it("imports yml files from a folder", async () => {
    const upsert = jest.fn();

    const importer = new ImportService(
      createMock<Logger>(),
      createMock<PrismaService>({
        challenge: { upsert, deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
        quizLevel: { deleteMany: jest.fn() },
      }),
      createMock<YamlReaderService>({
        readFile: jest
          .fn()
          .mockResolvedValueOnce({
            id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
            levels: [],
          })
          .mockResolvedValueOnce({
            id: "7a15a6de-306c-4a8b-9765-a1d5c6b91085",
            levels: [],
          }),
      }),
    );

    await importer.importAllFromFolder(path);

    expect(upsert).toHaveBeenCalledTimes(2);
    expect(upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083" },
      }),
    );

    expect(upsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { id: "7a15a6de-306c-4a8b-9765-a1d5c6b91085" },
      }),
    );
  });

  it("deletes old challenges", async () => {
    const deleteMany = jest.fn().mockResolvedValue({ count: 1 });
    const challengeIds = [faker.datatype.uuid(), faker.datatype.uuid()];

    const importer = new ImportService(
      createMock<Logger>(),
      createMock<PrismaService>({
        challenge: { upsert: jest.fn(), deleteMany },
        quizLevel: { deleteMany: jest.fn() },
      }),
      createMock<YamlReaderService>({
        readFile: jest
          .fn()
          .mockResolvedValueOnce({
            id: challengeIds[0],
            levels: [],
          })
          .mockResolvedValueOnce({
            id: challengeIds[1],
            levels: [],
          }),
      }),
    );

    await importer.importAllFromFolder(path);

    expect(deleteMany).toHaveBeenNthCalledWith(1, {
      where: {
        id: {
          notIn: challengeIds,
        },
      },
    });
  });

  describe("challenge", () => {
    it("can import a challenge into the db", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "slug",
        name: "test",
        difficulty: "easy",
        introduction: "hello",
        levels: [],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.challenge.count()).toEqual(1);
      const storedChallenge = await prisma.challenge.findFirst();
      expect(storedChallenge.id).toEqual(challenge.id);
      expect(storedChallenge.name).toEqual(challenge.name);
      expect(storedChallenge.slug).toEqual(challenge.slug);
    });

    it("defaults to easy if the difficulty is not recognized", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "slug",
        name: "test",
        difficulty: "easy-peasy-lemon-squeezy",
        introduction: "hello",
        levels: [],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());
      await importer.importChallenge(challenge);

      const storedChallenge = await prisma.challenge.findFirst();
      expect(storedChallenge.difficulty).toBe(0);
    });
  });

  describe("rule", () => {
    it("can import a rule into the db", async () => {
      const prisma = getPrismaService();
      const rule: Rule = {
        id: "e9bf90c3-61fb-4d2f-99b0-33d380a8aa40",
        key: "a-test-rule",
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.upsertRule(rule);

      expect(await prisma.rule.count()).toEqual(1);
      const storedRule = await prisma.rule.findFirst();
      expect(storedRule.id).toEqual(rule.id);
    });
  });

  describe("level", () => {
    it("can import the code levels for a challenge", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "code",
            instructions: "hi",
            requirements: [],
            tasks: [],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.codeLevel.count()).toEqual(1);
      const level = challenge.levels[0] as CodeLevel;
      const storedLevel = await prisma.codeLevel.findFirst();
      expect(storedLevel.id).toEqual(level.id);
      expect(storedLevel.order).toEqual(level.order);
      expect(storedLevel.instructions).toEqual(level.instructions);
      expect(storedLevel.challengeId).toEqual(challenge.id);
    });

    it("can import the code levels with code for a challenge", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "code",
            instructions: "hi",
            requirements: [],
            tasks: [],
            code: {
              html: '<a href="/">hi</a>',
              css: "a { color: blue }",
              js: 'alert("hi")',
            },
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.codeLevel.count()).toEqual(1);
      const level = challenge.levels[0] as CodeLevel;
      const storedLevel = await prisma.codeLevel.findFirst();
      expect(storedLevel.html).toEqual(level.code.html);
      expect(storedLevel.css).toEqual(level.code.css);
      expect(storedLevel.js).toEqual(level.code.js);
    });

    it("sets the correct editor configuration for the code level", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "code",
            instructions: "hi",
            requirements: [],
            tasks: [],
            code: {
              html: '<a href="/">hi</a>',
              css: "a { color: blue }",
              js: 'alert("hi")',
            },
            has_editor: {
              js: false,
            },
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());
      await importer.importChallenge(challenge);

      expect(await prisma.codeLevel.count()).toEqual(1);
      const storedLevel = await prisma.codeLevel.findFirst();

      expect(storedLevel.hasHtmlEditor).toEqual(true);
      expect(storedLevel.hasCssEditor).toEqual(true);
      expect(storedLevel.hasJsEditor).toEqual(false);
    });

    it("can import quiz levels", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "quiz",
            question: "How are you today?",
            answer_options: [],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.quizLevel.count()).toEqual(1);
      const level = challenge.levels[0] as QuizLevel;
      const storedLevel = await prisma.quizLevel.findFirst();
      expect(storedLevel.id).toEqual(level.id);
      expect(storedLevel.order).toEqual(level.order);
      expect(storedLevel.question).toEqual(level.question);
      expect(storedLevel.challengeId).toEqual(challenge.id);
    });

    it("can import answers for quiz levels", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "quiz",
            question: "How are you today?",
            answer_options: [
              {
                id: faker.datatype.uuid(),
                text: "I'm fine",
                correct: true,
              },
              {
                id: faker.datatype.uuid(),
                text: "I'm not fine",
                correct: false,
              },
            ],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.answerOption.count()).toEqual(2);
      const answerOption = (challenge.levels[0] as QuizLevel).answer_options[0];
      const storedAnswerOption = await prisma.answerOption.findUnique({ where: { id: answerOption.id } });
      expect(storedAnswerOption.id).toEqual(answerOption.id);
      expect(storedAnswerOption.text).toEqual(answerOption.text);
      expect(storedAnswerOption.quizLevelId).toEqual(challenge.levels[0].id);
    });

    it("deletes quiz levels from a challenge if they are deleted", async () => {
      const prisma = getPrismaService();
      const challengeWithoutLevels: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [],
      };
      const challenge: Challenge = {
        ...challengeWithoutLevels,
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "quiz",
            question: "How are you today?",
            answer_options: [
              {
                id: faker.datatype.uuid(),
                correct: true,
                text: "Options",
              },
            ],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);
      await importer.importChallenge(challengeWithoutLevels);

      expect(await prisma.quizLevel.count()).toEqual(0);
    });
  });

  describe("requirement", () => {
    it("can import the requirement for a level", async () => {
      const prisma = getPrismaService();
      await prisma.rule.create({
        data: {
          id: "372b3ffe-7e38-456d-b7d7-46cb29945c6a",
          key: "test-rule",
        },
      });

      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "code",
            instructions: "hi",
            tasks: [],
            requirements: [{ id: faker.datatype.uuid(), title: "lala", description: "asdf", key: "test-rule" }],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.requirement.count()).toEqual(1);
      const requirement = (challenge.levels[0] as CodeLevel).requirements[0];
      const storedRequirement = await prisma.requirement.findFirst();
      expect(storedRequirement.id).toEqual(requirement.id);
      expect(storedRequirement.title).toEqual(requirement.title);
      expect(storedRequirement.levelId).toEqual(challenge.levels[0].id);
    });

    it("can associate a rule with a requirement", async () => {
      const ruleKey = "a-test-rule";

      const prisma = getPrismaService();
      const rule: Rule = {
        id: "e9bf90c3-61fb-4d2f-99b0-33d380a8aa40",
        key: ruleKey,
      };

      const challenge: Challenge = {
        id: "8d42d73f-e566-4575-8250-2c1532feb856",
        slug: "super-challenge",
        name: "best challenge ever",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: "f3b74759-59b7-4e42-83de-f68886b30a61",
            order: 0,
            type: "code",
            instructions: "do your best",
            tasks: [],
            requirements: [
              {
                id: "3d4c5f81-dad5-4c1b-b732-71d789506b4c",
                title: "teeeeest",
                description: "asdf",
                key: ruleKey,
              },
            ],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.upsertRule(rule);
      await importer.importChallenge(challenge);

      const storedRequirement = await prisma.requirement.findFirst({
        include: { rule: true },
      });

      expect(storedRequirement.rule).toBeTruthy();
      expect(storedRequirement.rule.key).toBe(ruleKey);
    });
  });

  describe("task", () => {
    it("can import the tasks for a level", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "code",
            instructions: "hi",
            requirements: [],
            tasks: [
              { id: "545dd1d8-eaf2-41c0-b84a-b2aff775f169", text: "do stuff", hints: [] },
              { id: "0b63888a-64c5-481c-ae54-41fd96c873b0", text: "do more stuff", hints: [] },
            ],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.task.count()).toEqual((challenge.levels[0] as CodeLevel).tasks.length);
      const task = (challenge.levels[0] as CodeLevel).tasks[0];

      const storedTask = await prisma.task.findUnique({ where: { id: task.id } });
      expect(storedTask.text).toEqual(task.text);
      expect(storedTask.levelId).toEqual(challenge.levels[0].id);
    });
  });

  describe("hint", () => {
    it("can import the hints for a task", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: faker.datatype.uuid(),
            order: 1,
            type: "code",
            instructions: "hi",
            requirements: [],
            tasks: [
              {
                id: "545dd1d8-eaf2-41c0-b84a-b2aff775f169",
                text: "do stuff",
                hints: [{ id: "f60d5eae-495b-4afc-9db8-9c4decf4aa7f", text: "do it like dis" }],
              },
            ],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.hint.count()).toEqual((challenge.levels[0] as CodeLevel).tasks[0].hints.length);
      const hint = (challenge.levels[0] as CodeLevel).tasks[0].hints[0];

      const storedHint = await prisma.hint.findFirst();
      expect(storedHint.id).toEqual(hint.id);
      expect(storedHint.text).toEqual(hint.text);
      expect(storedHint.taskId).toEqual((challenge.levels[0] as CodeLevel).tasks[0].id);
    });
  });
});
