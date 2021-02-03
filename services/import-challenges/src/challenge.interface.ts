export interface Challenge {
  id: string;
  name: string;
  levels: Level[];
}

export interface Level {
  id: string;
  tldr: string;
  instructions: string;
  requirements: Requirement[];
  hints: Hint[];
  resources: Resource[];
}

export interface Requirement {
  id: string;
  title: string;
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
