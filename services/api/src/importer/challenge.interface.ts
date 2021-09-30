export interface Challenge {
  id: string;
  name: string;
  slug: string;
  difficulty: string;
  introduction: string;
  order?: number;
  levels: Level[];
}

export type Level = CodeLevel | QuizLevel;

export interface CodeLevel {
  id: string;
  order: number;
  type: "code";
  requirements: Requirement[];
  instructions: string;
  tasks: Task[];
  code?: Code;
  has_editor?: HasEditor;
}

export interface QuizLevel {
  id: string;
  order: number;
  type: "quiz";
  answer_options: AnswerOption[];
  question: string;
}

export interface AnswerOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  order?: number;
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
