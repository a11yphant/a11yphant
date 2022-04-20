import { JwtScope } from "../enums/jwt-scope.enum";

export interface JwtSessionCookie {
  // self defined fields
  scope: JwtScope;

  // jwt standard fields
  sub: string; // we save the user id here
  iat: number;
  exp: number;
  iss: string;
}
