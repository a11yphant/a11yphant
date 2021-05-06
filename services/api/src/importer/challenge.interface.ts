export interface Challenge {
  id: string;
  name: string;
  slug: string;
  difficulty: string;
  introduction: string;
  levels: Level[];
}

export interface Level {
  id: string;
  order: number;
  requirements: Requirement[];
  instructions: string;
  tasks: Task[];
  code?: Code;
  has_editor?: HasEditor;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  key: string;
  options?: { [key: string]: string };
}

export interface Task {
  id: string;
  text: string;
  hints: Hint[];
}

export interface Hint {
  id: string;
  text: string;
}

interface Code {
  html?: string;
  css?: string;
  js?: string;
}

interface HasEditor {
  html?: boolean;
  css?: boolean;
  js?: boolean;
}
