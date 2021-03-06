import { PrismaService, useDatabase } from '@a11y-challenges/prisma';
import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import * as mock from 'mock-fs';
import { join } from 'path';

import { Challenge } from './challenge.interface';
import { ImportService } from './import.service';
import { YamlReaderService } from './yaml-reader.service';

describe('import service', () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  afterEach(() => {
    mock.restore();
  });

  it('can import a challenge into the db', async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
      name: 'test',
      levels: [],
    };

    const importer = new ImportService(
      createMock<Logger>(),
      prisma,
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(await prisma.challenge.count()).toEqual(1);
    const storedChallenge = await prisma.challenge.findFirst();
    expect(storedChallenge.id).toEqual(challenge.id);
    expect(storedChallenge.name).toEqual(challenge.name);
  });

  it('can import the levels for a challenge', async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
      name: 'test',
      levels: [
        {
          id: 'a',
          tldr: 'hi',
          instructions: 'hi',
          hints: [],
          requirements: [],
          resources: [],
        },
      ],
    };

    const importer = new ImportService(
      createMock<Logger>(),
      prisma,
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(await prisma.level.count()).toEqual(1);
    const level = challenge.levels[0];
    const storedLevel = await prisma.level.findFirst();
    expect(storedLevel.id).toEqual(level.id);
    expect(storedLevel.tldr).toEqual(level.tldr);
    expect(storedLevel.instructions).toEqual(level.instructions);
    expect(storedLevel.challengeId).toEqual(challenge.id);
  });

  it('can import the levels with code for a challenge', async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
      name: 'test',
      levels: [
        {
          id: 'a',
          tldr: 'hi',
          instructions: 'hi',
          hints: [],
          requirements: [],
          resources: [],
          code: {
            html: '<a href="/">hi</a>',
            css: 'a { color: blue }',
            js: 'alert("hi")',
          },
        },
      ],
    };

    const importer = new ImportService(
      createMock<Logger>(),
      prisma,
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(await prisma.level.count()).toEqual(1);
    const level = challenge.levels[0];
    const storedLevel = await prisma.level.findFirst();
    expect(storedLevel.html).toEqual(level.code.html);
    expect(storedLevel.css).toEqual(level.code.css);
    expect(storedLevel.js).toEqual(level.code.js);
  });

  it('can import the requirements for a level', async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
      name: 'test',
      levels: [
        {
          id: 'a',
          tldr: 'hi',
          instructions: 'hi',
          hints: [],
          requirements: [{ id: 'asdf', title: 'lala' }],
          resources: [],
        },
      ],
    };

    const importer = new ImportService(
      createMock<Logger>(),
      prisma,
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(await prisma.requirement.count()).toEqual(1);
    const requirement = challenge.levels[0].requirements[0];
    const storedRequirement = await prisma.requirement.findFirst();
    expect(storedRequirement.id).toEqual(requirement.id);
    expect(storedRequirement.title).toEqual(requirement.title);
    expect(storedRequirement.levelId).toEqual(challenge.levels[0].id);
  });

  it('can import the hints for a level', async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
      name: 'test',
      levels: [
        {
          id: 'a',
          tldr: 'hi',
          instructions: 'hi',
          hints: [{ id: 'asdf', content: 'lala' }],
          requirements: [],
          resources: [],
        },
      ],
    };

    const importer = new ImportService(
      createMock<Logger>(),
      prisma,
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(await prisma.hint.count()).toEqual(1);
    const hint = challenge.levels[0].hints[0];
    const storedHint = await prisma.hint.findFirst();
    expect(storedHint.id).toEqual(hint.id);
    expect(storedHint.content).toEqual(hint.content);
    expect(storedHint.levelId).toEqual(challenge.levels[0].id);
  });

  it('can import the resources for a level', async () => {
    const prisma = getPrismaService();
    const challenge: Challenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
      name: 'test',
      levels: [
        {
          id: 'a',
          tldr: 'hi',
          instructions: 'hi',
          hints: [],
          requirements: [],
          resources: [{ id: 'asdf', title: 'lala', link: 'http://asdf.com' }],
        },
      ],
    };

    const importer = new ImportService(
      createMock<Logger>(),
      prisma,
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(await prisma.resource.count()).toEqual(1);
    const resource = challenge.levels[0].resources[0];
    const storedResource = await prisma.resource.findFirst();
    expect(storedResource.id).toEqual(resource.id);
    expect(storedResource.title).toEqual(resource.title);
    expect(storedResource.link).toEqual(resource.link);
    expect(storedResource.levelId).toEqual(challenge.levels[0].id);
  });

  it('imports yml files from a folder', async () => {
    const upsert = jest.fn();
    mock({
      [join(__dirname, 'test-challenges')]: {
        '1.yml': '',
        '2.yml': '',
        'asdf.png': '',
        '.': {},
      },
    });

    const importer = new ImportService(
      createMock<Logger>(),
      createMock<PrismaService>({
        challenge: { upsert },
      }),
      createMock<YamlReaderService>({
        readChallenge: jest
          .fn()
          .mockResolvedValueOnce({
            id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
            levels: [],
          })
          .mockResolvedValueOnce({
            id: '7a15a6de-306c-4a8b-9765-a1d5c6b91085',
            levels: [],
          }),
      }),
    );

    await importer.importAllFromFolder('test-challenges');

    expect(upsert).toHaveBeenCalledTimes(2);
    expect(upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083' },
      }),
    );

    expect(upsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { id: '7a15a6de-306c-4a8b-9765-a1d5c6b91085' },
      }),
    );
  });
});
