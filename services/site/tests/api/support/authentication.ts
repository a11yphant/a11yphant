import { INestApplication } from "@nestjs/common";
import { User } from "@prisma/client";

import { JwtScope } from "@/authentication/enums/jwt-scope.enum";
import { JwtService } from "@/authentication/jwt.service";
import { PrismaService } from "@/prisma/prisma.service";

import { Factory, USER, UserData } from "./factories/database";

export async function createUserWithSessionCookie(prisma: PrismaService, app: INestApplication): Promise<{ user: User; cookie: string }> {
  const user = await prisma.user.create({ data: Factory.build<UserData>(USER, { authProvider: "github", displayName: "Test User" }) });
  const jwtService = app.get<JwtService>(JwtService);

  const cookie = await jwtService.createSignedToken({ scope: JwtScope.SESSION }, { subject: user.id, expiresInSeconds: 3600 });

  return { cookie, user };
}
