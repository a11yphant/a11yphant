export interface RawChallenge {
  id: string;
  name: string;
  levels: Level[];
}

interface Level {
  id: string;
  tldr: string;
  instructions: string;
  requirements: Requirement[];
  hints: Hint[];
  resources: Resource[];
}

interface Requirement {
  id: string;
  title: string;
}

interface Hint {
  id: string;
  content: string;
}

interface Resource {
  id: string;
  title: string;
  link: string;
}
