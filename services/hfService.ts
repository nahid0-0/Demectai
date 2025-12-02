import type { DetectionResult } from '../types';

// Use relative path - works for both local dev and Vercel
const API_URL = "/api/detect";

interface HFResponse {
  ai_percentage: number;
  real_percentage: number;
  verdict: string;
  confidence: number;
  tcn_ai_prob: number;
  resnet_ai_prob: number;
  error?: string;
}

function processResult(hfResult: HFResponse): DetectionResult {
  if (hfResult.error) {
    throw new Error(hfResult.error);
  }

  const isAi = hfResult.ai_percentage > 50;
  const confidence = hfResult.confidence / 100;

  return {
    isAiGenerated: isAi,
    confidence: isAi ? confidence : 1 - confidence,
    analysis: generateAnalysis(hfResult),
    modelGuessed: isAi ? "Unknown AI Model" : "N/A",
    suspiciousRegions: generateSuspiciousRegions(hfResult)
  };
}

export async function detectImageHF(imageBase64: string, mimeType: string): Promise<DetectionResult> {
  try {
    // Call our API endpoint (works both locally and on Vercel)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: `data:${mimeType};base64,${imageBase64}`,
        mimeType: mimeType
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }

    const hfResult = await response.json() as HFResponse;
    return processResult(hfResult);

  } catch (error) {
    console.error("Error calling HF API:", error);
    throw new Error("Failed to get a valid response from the AI detector.");
  }
}

function generateAnalysis(result: HFResponse): string {
  const { ai_percentage, tcn_ai_prob, resnet_ai_prob, verdict } = result;
  
  if (verdict === "AI Generated") {
    return `This image is likely AI-generated with ${ai_percentage.toFixed(1)}% confidence. ` +
      `Our TCN model detected ${tcn_ai_prob.toFixed(1)}% AI probability, ` +
      `while the ResNet-1D model detected ${resnet_ai_prob.toFixed(1)}% AI probability. ` +
      `The ensemble analysis strongly suggests artificial generation patterns in the image.`;
  } else {
    return `This image appears to be authentic with ${result.real_percentage.toFixed(1)}% confidence. ` +
      `Our TCN model detected only ${tcn_ai_prob.toFixed(1)}% AI probability, ` +
      `and the ResNet-1D model detected ${resnet_ai_prob.toFixed(1)}% AI probability. ` +
      `The ensemble analysis suggests this is a genuine photograph.`;
  }
}

function generateSuspiciousRegions(result: HFResponse): Array<{area: string, reason: string}> {
  if (result.ai_percentage < 30) {
    return [];
  }
  
  const regions: Array<{area: string, reason: string}> = [];
  
  if (result.ai_percentage > 70) {
    regions.push({
      area: "Overall image structure",
      reason: "High-confidence AI generation patterns detected in spatial features"
    });
  }
  
  if (result.tcn_ai_prob > 60) {
    regions.push({
      area: "Temporal/sequential patterns",
      reason: "TCN model detected characteristic AI generation sequences"
    });
  }
  
  if (result.resnet_ai_prob > 60) {
    regions.push({
      area: "Deep feature analysis",
      reason: "ResNet model identified synthetic texture patterns"
    });
  }
  
  return regions;
}
