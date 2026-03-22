export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ExtractedCriteria {
  property_type?: string;
  cities?: string[];
  budget_min?: number;
  budget_max?: number;
  bedrooms?: number;
  surface_min?: number;
  transaction_type?: string;
  other_criteria?: Record<string, any>;
}

export interface ChatMessage extends Message {
  timestamp: Date;
  extracted_criteria?: ExtractedCriteria;
  qualification_score?: number;
}