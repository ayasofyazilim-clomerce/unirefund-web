import * as faceapi from "face-api.js";

// Utility function to load face-api.js models
export async function loadFaceApiModels() {
  try {
    // Load models from a CDN if local models are not available
    const modelUrl = "https://justadudewhohacks.github.io/face-api.js/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
      faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
    ]);
    return true;
  } catch {
    return false;
  }
}

// Function to detect face expressions
export async function detectExpressions(videoElement: HTMLVideoElement) {
  const detections = await faceapi
    .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  return detections;
}

// Check if a specific expression is dominant with a given threshold
export function isExpressionDominant(expressions: faceapi.FaceExpressions, expressionName: string, threshold = 0.7) {
  const expressionValue = expressions[expressionName as keyof faceapi.FaceExpressions];
  // Ensure expressionValue is a number before comparison
  return typeof expressionValue === "number" && expressionValue > threshold;
}
