import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, Logger],
  exports: [PrismaService],
})
export class PrismaModule {}
