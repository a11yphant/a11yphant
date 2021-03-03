import { PrismaModule } from "@a11y-challenges/prisma";
import { Module } from "@nestjs/common";

import { ChallengeResolver } from "./challenge.resolver";
import { ChallengeService } from "./challenge.service";
import { LevelService } from "./level.service";

@Module({
  imports: [PrismaModule],
  providers: [ChallengeResolver, ChallengeService, LevelService],
})
export class ChallengeModule {}
