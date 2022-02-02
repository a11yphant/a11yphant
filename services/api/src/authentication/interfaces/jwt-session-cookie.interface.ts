import { JwtScope } from "../enums/jwt-scope.enum";

export interface JwtSessionCookie {
  // self defined fields
  scope: JwtScope;
  userId: string;

  // jwt standard fields
  sub: string;
  iat: number;
  exp: number;
  iss: string;
}
