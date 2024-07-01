import { Request, Response } from "express";

import { SessionToken } from "./session-token.interface";

export interface Context {
  req: Request;
  res: Response;
  sessionToken: SessionToken;
}
