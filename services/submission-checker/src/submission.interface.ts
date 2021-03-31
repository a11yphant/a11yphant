import { Level } from "./level.interface";

export class Submission {
  id: string;
  html: string;
  css: string;
  js: string;
  level?: Level;
}
