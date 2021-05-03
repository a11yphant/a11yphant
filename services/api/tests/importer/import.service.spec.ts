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

  it("can import a challenge into the db", async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
      slug: "slug",
      name: "test",
      difficulty: "easy",
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

  it("can import a rule into the db", async () => {
    const prisma = getPrismaService();
    const rule: Rule = {
      id: "e9bf90c3-61fb-4d2f-99b0-33d380a8aa40",
      key: "a-test-rule",
      title: "test",
      shortDescription: "testing is awesome!",
    };

    const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

    await importer.upsertRule(rule);

    expect(await prisma.rule.count()).toEqual(1);
    const storedRule = await prisma.rule.findFirst();
    expect(storedRule.id).toEqual(rule.id);
  });

  it("can import the levels for a challenge", async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
      slug: "test-slug",
      name: "test",
      difficulty: "easy",
      levels: [
        {
          id: "a",
          order: 1,
          tldr: "hi",
          instructions: "hi",
          hints: [],
          requirements: [],
          resources: [],
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
    expect(storedLevel.tldr).toEqual(level.tldr);
    expect(storedLevel.instructions).toEqual(level.instructions);
    expect(storedLevel.challengeId).toEqual(challenge.id);
  });

  it("can import the levels with code for a challenge", async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
      slug: "test-slug",
      name: "test",
      difficulty: "easy",
      levels: [
        {
          id: "a",
          order: 1,
          tldr: "hi",
          instructions: "hi",
          hints: [],
          requirements: [],
          resources: [],
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

  it("can import the requirements for a level", async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
      slug: "test-slug",
      name: "test",
      difficulty: "easy",
      levels: [
        {
          id: "a",
          order: 1,
          tldr: "hi",
          instructions: "hi",
          hints: [],
          requirements: [{ id: "asdf", title: "lala", rules: [] }],
          resources: [],
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

  it("can import the hints for a level", async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
      slug: "test-slug",
      name: "test",
      difficulty: "easy",
      levels: [
        {
          id: "a",
          order: 1,
          tldr: "hi",
          instructions: "hi",
          hints: [{ id: "asdf", content: "lala" }],
          requirements: [],
          resources: [],
        },
      ],
    };

    const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

    await importer.importChallenge(challenge);

    expect(await prisma.hint.count()).toEqual(1);
    const hint = challenge.levels[0].hints[0];
    const storedHint = await prisma.hint.findFirst();
    expect(storedHint.id).toEqual(hint.id);
    expect(storedHint.content).toEqual(hint.content);
    expect(storedHint.levelId).toEqual(challenge.levels[0].id);
  });

  it("can import the resources for a level", async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: "6a15a6de-306c-4a8b-9765-a1d5c6b91083",
      slug: "test-slug",
      name: "test",
      difficulty: "easy",
      levels: [
        {
          id: "a",
          order: 1,
          tldr: "hi",
          instructions: "hi",
          hints: [],
          requirements: [],
          resources: [{ id: "asdf", title: "lala", link: "http://asdf.com" }],
        },
      ],
    };

    const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

    await importer.importChallenge(challenge);

    expect(await prisma.resource.count()).toEqual(1);
    const resource = challenge.levels[0].resources[0];
    const storedResource = await prisma.resource.findFirst();
    expect(storedResource.id).toEqual(resource.id);
    expect(storedResource.title).toEqual(resource.title);
    expect(storedResource.link).toEqual(resource.link);
    expect(storedResource.levelId).toEqual(challenge.levels[0].id);
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

  it("can associate a rule with a requirement", async () => {
    const ruleKey = "a-test-rule";

    const prisma = getPrismaService();
    const rule: Rule = {
      id: "e9bf90c3-61fb-4d2f-99b0-33d380a8aa40",
      key: ruleKey,
      title: "test",
      shortDescription: "testing is awesome!",
    };

    const challenge: Challenge = {
      id: "8d42d73f-e566-4575-8250-2c1532feb856",
      slug: "super-challenge",
      name: "best challenge ever",
      difficulty: "easy",
      levels: [
        {
          id: "f3b74759-59b7-4e42-83de-f68886b30a61",
          hints: [],
          tldr: "xoxo",
          order: 0,
          instructions: "do your best",
          resources: [],
          requirements: [
            {
              id: "3d4c5f81-dad5-4c1b-b732-71d789506b4c",
              title: "teeeeest",
              rules: [ruleKey],
            },
          ],
        },
      ],
    };

    const importer = new ImportService(createMock<Logger>(), prisma, createMock<YamlReaderService>());

    await importer.upsertRule(rule);
    await importer.importChallenge(challenge);

    const storedRequirement = await prisma.requirement.findFirst({
      include: { rules: true },
    });

    expect(storedRequirement.rules).toBeTruthy();
    expect(storedRequirement.rules[0].key).toBe(ruleKey);
  });
});
