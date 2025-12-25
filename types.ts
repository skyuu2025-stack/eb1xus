
export enum VisaType {
  EB1A = 'EB1A',
  O1 = 'O1'
}

export type AppView = 'landing' | 'dashboard' | 'assessment' | 'billing' | 'history' | 'studio' | 'counsel';

export interface Criterion {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface AssessmentData {
  visaType: VisaType;
  name: string;
  field: string;
  criteriaScores: Record<string, string>;
  resumeText: string;
}

export interface AIAnalysisResult {
  overallScore: number;
  qualifiedCriteria: string[];
  weakCriteria: string[];
  recommendations: string[];
  strategicPlan: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'quarter' | 'year' | 'free';
  features: string[];
  isPopular?: boolean;
}
