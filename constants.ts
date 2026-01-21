import { Question, AnalysisType } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'q_baseline_1',
    type: AnalysisType.BASELINE,
    text: "Please introduce yourself briefly.",
    description: "Establishing baseline vocal tone and speaking pace."
  },
  {
    id: 'q_baseline_2',
    type: AnalysisType.BASELINE,
    text: "Where are you currently based?",
    description: "Observing neutral, factual response behavior."
  },
  {
    id: 'q_baseline_3',
    type: AnalysisType.BASELINE,
    text: "What subject or domain are you most comfortable with?",
    description: "Identifying confident body language in comfort zones."
  },
  {
    id: 'q_baseline_4',
    type: AnalysisType.BASELINE,
    text: "How is your day going so far?",
    description: "Checking natural conversational rhythm and emotional baseline."
  },
  {
    id: 'q_logic_1',
    type: AnalysisType.LOGICAL,
    text: "Describe a complex problem you solved recently. What was your specific role in the solution?",
    description: "Analyzing cognitive load, structural coherence, and confidence markers."
  },
  {
    id: 'q_emotional_1',
    type: AnalysisType.EMOTIONAL,
    text: "Tell me about a time you made a significant mistake. How did you handle the consequences?",
    description: "Detecting stress indicators, defensive body language, and emotional regulation."
  }
];

export const DISCLAIMER_TEXT = `
VERITEX is designed for behavioral and confidence analysis only. 
It does not detect lies. 
Results are probabilistic estimates based on vocal patterns, linguistic structure, and behavioral signals.
Do not use this tool for legal, hiring, or relationship decisions.
`;