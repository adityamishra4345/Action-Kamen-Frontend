export interface TextAnalysisRequest {
  text: string;
}

export interface TextAnalysisResponse {
  verdict: 'PHISHING' | 'SUSPICIOUS' | 'SAFE';
  threat_score: number;
  triggered_keywords: string[];
  nlp_label: string;
  nlp_confidence: number;
  findings: string[];
}

export interface QRInspectionRequest {
  content: string;
}

export interface QRInspectionResponse {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  threat_score: number;
  content_type: 'URL' | 'TEXT' | 'COMMAND';
  redirect_chain: string[];
  typosquat_match: string | null | boolean;
  tld_risk: boolean;
  apk_detected: boolean;
  findings: string[];
}