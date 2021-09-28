import { Module } from "@nestjs/common";

import { PrismaModule } from "@/prisma/prisma.module";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
