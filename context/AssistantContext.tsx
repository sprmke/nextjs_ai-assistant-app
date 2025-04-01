import { createContext } from 'react';

import { AiAssistant } from '@/app/(main)/types';

type AssistantContextType = {
  assistant: AiAssistant | null;
  setAssistant: (assistant: AiAssistant) => void;
};

export const AssistantContext = createContext<AssistantContextType>({
  assistant: null,
  setAssistant: () => {},
});
