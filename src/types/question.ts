export const QUESTION_CATEGORIES = [
  "geral",
  "pessoas",
  "lugares",
  "comida",
  "entretenimento",
  "internet",
  "relacionamentos",
  "situacoes",
  "absurdo",
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  enabled: boolean;
}
