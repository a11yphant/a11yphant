import awsMock from 'aws-sdk-mock';
import fs from 'fs/promises';

import { S3DownloadService } from './s3-download.service';

jest.mock('fs/promises');

describe('download service', () => {
  afterEach(() => {
    awsMock.restore();
    jest.resetAllMocks();
  });

  it('downloads an object from s3', async () => {
    const zipContent = 'zip-file-content';

    awsMock.mock('S3', 'getObject', {
      Body: zipContent,
    });

    const service = new S3DownloadService();

    await service.download('bucket-name', 'key', '/tmp/target-path');

    expect(fs.writeFile).toHaveBeenCalledWith('/tmp/target-path', zipContent);
  });
});
