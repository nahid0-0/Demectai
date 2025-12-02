
export interface ImageData {
  url: string; // For preview (data URL or remote URL)
  base64: string; // Base64 representation without prefix
  mimeType: string;
}

export interface SuspiciousRegion {
  area: string;
  reason: string;
}

export interface DetectionResult {
  isAiGenerated: boolean;
  confidence: number;
  analysis: string;
  modelGuessed: string;
  suspiciousRegions: SuspiciousRegion[];
}
