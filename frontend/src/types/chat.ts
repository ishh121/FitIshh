export interface ChatMessage {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  timestamp: string;
  tags?: string[];
  suggestions?: string[];
}

export interface QuickPrompt {
  id: string;
  title: string;
  prompt: string;
  category: 'diet' | 'workout' | 'family' | 'ayurveda';
}
