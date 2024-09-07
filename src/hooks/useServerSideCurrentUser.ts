import "server-only";

import { ConfigService } from "@nestjs/config";
import { JwtScope } from "app/api/authentication/enums/jwt-scope.enum";
import { JwtSessionCookie } from "app/api/authentication/interfaces/jwt-session-cookie.interface";
import { JwtService } from "app/api/authentication/jwt.service";
import { User } from "app/api/user/models/user.model";
import { UserService } from "app/api/user/user.service";
import { useService } from "app/hooks/useService";
import { cookies } from "next/headers";

export async function useServerSideCurrentUser(): Promise<User> {
  const jwtService = await useService<JwtService>(JwtService);
  await useService<JwtService>(JwtService);
  const userService = await useService<UserService>(UserService);
  const configService = await useService<ConfigService>(ConfigService);

  const cookieJar = cookies();
  const sessionCookie = cookieJar.get(configService.get<string>("cookie.name"));

  if (!(await jwtService.validateToken(sessionCookie.value, JwtScope.SESSION))) {
    return null;
  }

  const { sub: userId } = jwtService.decodeToken<JwtSessionCookie>(sessionCookie.value);

  return userService.findById(userId);
}
