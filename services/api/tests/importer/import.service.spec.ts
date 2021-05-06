import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import mock from "mock-fs";
import { join } from "path";

import { Challenge } from "../../src/importer/challenge.interface";
import { ImportService } from "../../src/importer/import.service";
import { Rule } from "../../src/importer/rule.interface";
import { YamlReaderService } from "../../src/importer/yaml-reader.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { useDatabase } from "../helpers";

describe("import service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  afterEach(() => {
    mock.restore();
  });

  it("imports yml files from a folder", async () => {
    const upsert = jest.fn();
    const path = join(__dirname, "test-challenges");
    mock({
      [path]: {
        "challenge-1.yml": "",
        "challenge-2.yml": "",
        "asdf.png": "",
        ".": {},
      },
    });

    const importer = new ImportService(
      createMock<Logger>(),
      createMock<PrismaService>({
        challenge: { upsert },
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
    it("can import the levels for a challenge", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: "a",
            order: 1,
            instructions: "hi",
            requirements: [],
            tasks: [],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.level.count()).toEqual(1);
      const level = challenge.levels[0];
      const storedLevel = await prisma.level.findFirst();
      expect(storedLevel.id).toEqual(level.id);
      expect(storedLevel.order).toEqual(level.order);
      expect(storedLevel.instructions).toEqual(level.instructions);
      expect(storedLevel.challengeId).toEqual(challenge.id);
    });

    it("can import the levels with code for a challenge", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: "a",
            order: 1,
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

      expect(await prisma.level.count()).toEqual(1);
      const level = challenge.levels[0];
      const storedLevel = await prisma.level.findFirst();
      expect(storedLevel.html).toEqual(level.code.html);
      expect(storedLevel.css).toEqual(level.code.css);
      expect(storedLevel.js).toEqual(level.code.js);
    });

    it("sets the correct editor configuration for the level", async () => {
      const prisma = getPrismaService();
      const challenge: Challenge = {
        id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
        slug: "test-slug",
        name: "test",
        introduction: "hello",
        difficulty: "easy",
        levels: [
          {
            id: "a",
            order: 1,
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

      expect(await prisma.level.count()).toEqual(1);
      const storedLevel = await prisma.level.findFirst();

      expect(storedLevel.hasHtmlEditor).toEqual(true);
      expect(storedLevel.hasCssEditor).toEqual(true);
      expect(storedLevel.hasJsEditor).toEqual(false);
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
            id: "a",
            order: 1,
            instructions: "hi",
            tasks: [],
            requirements: [{ id: "asdf", title: "lala", description: "asdf", key: "test-rule" }],
          },
        ],
      };

      const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

      await importer.importChallenge(challenge);

      expect(await prisma.requirement.count()).toEqual(1);
      const requirement = challenge.levels[0].requirements[0];
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
            id: "a",
            order: 1,
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

      expect(await prisma.task.count()).toEqual(challenge.levels[0].tasks.length);
      const task = challenge.levels[0].tasks[0];

      const storedTask = await prisma.task.findFirst();
      expect(storedTask.id).toEqual(task.id);
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
            id: "a",
            order: 1,
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

      expect(await prisma.hint.count()).toEqual(challenge.levels[0].tasks[0].hints.length);
      const hint = challenge.levels[0].tasks[0].hints[0];

      const storedHint = await prisma.hint.findFirst();
      expect(storedHint.id).toEqual(hint.id);
      expect(storedHint.text).toEqual(hint.text);
      expect(storedHint.taskId).toEqual(challenge.levels[0].tasks[0].id);
    });
  });
});
