export type AiAssistant = {
  id: string;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
  aiModelId?: string;
  userId?: string;
};

export type AiAssistants = AiAssistant[];
