import { createMock } from '@golevelup/ts-jest';
import * as mock from 'mock-fs';
import { join } from 'path';

import { ImportService } from './import.service';
import { PrismaService } from './prisma/prisma.service';
import { YamlReaderService } from './yaml-reader.service';

describe('import service', () => {
  it('can import a challenge into the db', async () => {
    const upsert = jest.fn();
    const challenge = {
      id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083',
    };

    const importer = new ImportService(
      createMock<PrismaService>({
        challenge: { upsert },
      }),
      createMock<YamlReaderService>(),
    );

    await importer.importChallenge(challenge);

    expect(upsert).toHaveBeenCalled();
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
      createMock<PrismaService>({
        challenge: { upsert },
      }),
      createMock<YamlReaderService>({
        readChallenge: jest
          .fn()
          .mockResolvedValueOnce({ id: '6a15a6de-306c-4a8b-9765-a1d5c6b91083' })
          .mockResolvedValueOnce({
            id: '7a15a6de-306c-4a8b-9765-a1d5c6b91085',
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
