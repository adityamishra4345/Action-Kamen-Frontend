import type {
  TextAnalysisResponse,
  QRInspectionResponse,
} from "../types/index";
export const mockTextDatabase: Record<string, TextAnalysisResponse> = {
  urgent: {
    verdict: "PHISHING",
    threat_score: 90,
    triggered_keywords: ["account suspended", "verify OTP", "urgent"],
    nlp_label: "phishing/scan",
    nlp_confidence: 0.95,
    findings: [
      "Triggered localized risk indicator for: OTP Harvest",
      "Local MiniLM neural net flagged language alignment issues.",
    ],
  },
  winner: {
    verdict: "SUSPICIOUS",
    threat_score: 65,
    triggered_keywords: ["lottery", "claim prize", "winner"],
    nlp_label: "financial/scam",
    nlp_confidence: 0.82,
    findings: [
      "High probability of lottery fraud language detected.",
      "Asks for upfront personal details to claim a reward.",
    ],
  },
  default: {
    verdict: "SAFE",
    threat_score: 12,
    triggered_keywords: [],
    nlp_label: "safe business alert",
    nlp_confidence: 0.98,
    findings: [
      "No suspicious patterns or high-risk urgent triggers found in text content.",
    ],
  },
};

export const mockQRDatabase: Record<string, QRInspectionResponse> = {
  paypal: {
    verdict: "DANGEROUS",
    threat_score: 85,
    content_type: "URL",
    redirect_chain: [
      "http://bit.ly/fake-pay",
      "https://paypal-security-update.com",
    ],
    typosquat_match: "paypal",
    tld_risk: true,
    apk_detected: false,
    findings: [
      "High-risk or malicious top-level domain (TLD) detected.",
      "Potential typosquatting attempt mimicking a known financial brand.",
    ],
  },
  default: {
    verdict: "SAFE",
    threat_score: 5,
    content_type: "URL",
    redirect_chain: ["https://google.com"],
    typosquat_match: null,
    tld_risk: false,
    apk_detected: false,
    findings: [
      "Domain reputation is clean. No malicious redirect chains detected.",
    ],
  },
};
