import "server-only";

import { ConfigService } from "@nestjs/config";
import { JwtScope } from "app/api/authentication/enums/jwt-scope.enum";
import { JwtSessionCookie } from "app/api/authentication/interfaces/jwt-session-cookie.interface";
import { JwtService } from "app/api/authentication/jwt.service";
import { User } from "app/api/user/models/user.model";
import { UserService } from "app/api/user/user.service";
import { cookies } from "next/headers";

import { getService } from "./get-service";

export async function getServerSideCurrentUser(): Promise<User> {
  const jwtService = await getService<JwtService>(JwtService);
  const userService = await getService<UserService>(UserService);
  const configService = await getService<ConfigService>(ConfigService);

  const cookieJar = cookies();
  const sessionCookie = cookieJar.get(configService.get<string>("cookie.name"));

  if (!(await jwtService.validateToken(sessionCookie.value, JwtScope.SESSION))) {
    return null;
  }

  const { sub: userId } = jwtService.decodeToken<JwtSessionCookie>(sessionCookie.value);

  return userService.findById(userId);
}
