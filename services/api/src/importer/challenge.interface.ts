export interface Challenge {
  id: string;
  slug: string;
  name: string;
  levels: Level[];
}

export interface Level {
  id: string;
  order: number;
  tldr: string;
  instructions: string;
  requirements: Requirement[];
  hints: Hint[];
  resources: Resource[];
  code?: Code;
}

interface Code {
  html?: string;
  css?: string;
  js?: string;
}

export interface Requirement {
  id: string;
  title: string;
  rules: string[];
}

export interface Hint {
  id: string;
  content: string;
}

export interface Resource {
  id: string;
  title: string;
  link: string;
}