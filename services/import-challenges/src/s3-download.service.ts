import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { Extract } from 'unzipper';

@Injectable()
export class S3DownloadService {
  async download(bucket: string, key: string, path: string): Promise<void> {
    const s3 = new aws.S3({ httpOptions: { timeout: 3000 } });

    const { Body: content } = await s3
      .getObject({ Bucket: bucket, Key: key })
      .promise();

    await writeFile(path, content as Buffer);
  }

  async downloadAndUnzip(
    bucket: string,
    key: string,
    path: string,
  ): Promise<void> {
    const tmpZipFile = `${path}.zip`;
    await this.download(bucket, key, tmpZipFile);

    const zipStream = await createReadStream(tmpZipFile);
    await zipStream.pipe(Extract({ path: path })).promise();
  }
}
