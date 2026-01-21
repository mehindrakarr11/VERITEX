export enum AppMode {
  BOOT = 'BOOT',
  LANDING = 'LANDING',
  PERMISSIONS = 'PERMISSIONS',
  CALIBRATION = 'CALIBRATION',
  INTERVIEW = 'INTERVIEW',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
}

export enum AnalysisType {
  BASELINE = 'BASELINE',
  LOGICAL = 'LOGICAL',
  EMOTIONAL = 'EMOTIONAL',
}

export interface Question {
  id: string;
  text: string;
  type: AnalysisType;
  description: string;
}

export interface AnalysisMetric {
  confidence: number; // 0-100
  stress: number; // 0-100
  hesitation: number; // 0-100
  clarity: number; // 0-100
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface SessionData {
  responses: {
    questionId: string;
    transcript: string;
    duration: number;
    metrics: AnalysisMetric;
  }[];
  baseline: {
    wpm: number;
    avgPause: number;
  };
}

export interface WebRTCState {
  hasPermissions: boolean;
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
}