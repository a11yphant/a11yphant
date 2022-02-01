import { JwtScope } from "../enums/jwt-scope.enum";

export interface JwtSessionCookie {
  sub: string;
  scope: JwtScope;
}
