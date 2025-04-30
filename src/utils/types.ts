export interface TextEntry {
  id: string;
  text: string;
  emotions: EmotionLabels;
  originalIndex: number;
}

export interface EmotionLabels {
  joy: number;
  sadness: number;
  anticipation: number;
  surprise: number;
  anger: number;
  fear: number;
  disgust: number;
  trust: number;
}

export interface CSVRow {
  [key: string]: string;
}

export type EmotionType = keyof EmotionLabels;

export interface EmotionInfo {
  name: EmotionType;
  label: string;
  japaneseLabel: string;
  color: string;
  description: string;
}

export const emotions: EmotionInfo[] = [
  {
    name: 'joy',
    label: 'Joy',
    japaneseLabel: '喜び',
    color: '#FFD166',
    description: 'Feelings of happiness, pleasure, or satisfaction',
  },
  {
    name: 'sadness',
    label: 'Sadness',
    japaneseLabel: '悲しみ',
    color: '#118AB2',
    description: 'Feelings of sorrow, grief, or unhappiness',
  },
  {
    name: 'anticipation',
    label: 'Anticipation',
    japaneseLabel: '期待',
    color: '#06D6A0',
    description: 'Looking forward to or expecting something',
  },
  {
    name: 'surprise',
    label: 'Surprise',
    japaneseLabel: '驚き',
    color: '#9370DB',
    description: 'Feeling astonished or startled by something unexpected',
  },
  {
    name: 'anger',
    label: 'Anger',
    japaneseLabel: '怒り',
    color: '#EF476F',
    description: 'Strong feelings of annoyance, displeasure, or hostility',
  },
  {
    name: 'fear',
    label: 'Fear',
    japaneseLabel: '恐怖',
    color: '#6F58C9',
    description: 'An unpleasant emotion caused by the threat of danger, pain, or harm',
  },
  {
    name: 'disgust',
    label: 'Disgust',
    japaneseLabel: '嫌悪',
    color: '#5D675B',
    description: 'Strong disapproval or revulsion',
  },
  {
    name: 'trust',
    label: 'Trust',
    japaneseLabel: '信頼',
    color: '#7AC74F',
    description: 'Belief in the reliability, truth, or ability of someone or something',
  },
];

export const emotionColorMap: Record<EmotionType, string> = emotions.reduce(
  (acc, emotion) => ({
    ...acc,
    [emotion.name]: emotion.color,
  }),
  {} as Record<EmotionType, string>
);

export const defaultEmotionLabels: EmotionLabels = {
  joy: 0,
  sadness: 0,
  anticipation: 0,
  fear: 0,
  anger: 0,
  disgust: 0,
  surprise: 0,
  trust: 0,
};