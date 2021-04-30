import { Level } from "./level.interface";

export interface Submission {
  id: string;
  html: string;
  css: string;
  js: string;
  level?: Level;
}
