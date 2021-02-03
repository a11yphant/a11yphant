import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import * as mock from 'mock-fs';
import { join } from 'path';

import { ImportService } from './import.service';
import { PrismaService } from './prisma/prisma.service';
import { RawChallenge } from './raw-challenge.interface';
import { YamlReaderService } from './yaml-reader.service';

describe('import service', () => {
  it('can import a challenge into the db', async () => {
    const upsert = jest.fn();
    const challenge: RawChallenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
      name: 'test',
      levels: [],
    };

    const importer = new ImportService(
      createMock<Logger>(),
      createMock<PrismaService>({
        challenge: { upsert },
        level: { upsert: jest.fn().mockResolvedValue(null) },
        requirement: { upsert: jest.fn().mockResolvedValue(null) },
        hint: { upsert: jest.fn().mockResolvedValue(null) },
        resource: { upsert: jest.fn().mockResolvedValue(null) },
      }),
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(upsert).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledTimes(1);
  });

  it('can import the levels for a challenge', async () => {
    const upsert = jest.fn();
    const challenge: RawChallenge = {
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
      createMock<PrismaService>({
        challenge: { upsert: jest.fn().mockResolvedValue(null) },
        level: { upsert },
        requirement: { upsert: jest.fn().mockResolvedValue(null) },
        hint: { upsert: jest.fn().mockResolvedValue(null) },
        resource: { upsert: jest.fn().mockResolvedValue(null) },
      }),
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(upsert).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledTimes(1);
  });

  it('can import the requirements for a level', async () => {
    const upsert = jest.fn();
    const challenge: RawChallenge = {
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
      createMock<PrismaService>({
        challenge: { upsert: jest.fn().mockResolvedValue(null) },
        level: { upsert: jest.fn().mockResolvedValue(null) },
        requirement: { upsert },
        hint: { upsert: jest.fn().mockResolvedValue(null) },
        resource: { upsert: jest.fn().mockResolvedValue(null) },
      }),
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(upsert).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledTimes(1);
  });

  it('can import the hints for a level', async () => {
    const upsert = jest.fn();
    const challenge: RawChallenge = {
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
      createMock<PrismaService>({
        challenge: { upsert: jest.fn().mockResolvedValue(null) },
        level: { upsert: jest.fn().mockResolvedValue(null) },
        requirement: { upsert: jest.fn().mockResolvedValue(null) },
        hint: { upsert },
        resource: { upsert: jest.fn().mockResolvedValue(null) },
      }),
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(upsert).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledTimes(1);
  });

  it('can import the resources for a level', async () => {
    const upsert = jest.fn();
    const challenge: RawChallenge = {
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
      createMock<PrismaService>({
        challenge: { upsert: jest.fn().mockResolvedValue(null) },
        level: { upsert: jest.fn().mockResolvedValue(null) },
        requirement: { upsert: jest.fn().mockResolvedValue(null) },
        hint: { upsert: jest.fn().mockResolvedValue(null) },
        resource: { upsert },
      }),
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(upsert).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledTimes(1);
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
