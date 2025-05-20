"use server";
import {CompareFacesCommand, DetectFacesCommand, RekognitionClient} from "@aws-sdk/client-rekognition";
import {AnalyzeIDCommand, TextractClient} from "@aws-sdk/client-textract";
import {revalidatePath} from "next/cache";
/* eslint prefer-named-capture-group: off -- We need to disable this rule */
const regex = /^data:(.+);base64,(.+)$/;

export async function getAWSEnvoriment() {
  await Promise.resolve();
  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION is not defined");
  }
  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID is not defined");
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not defined");
  }
  return {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

// Define type for AWS authentication config
export type AWSAuthConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

const clientAuths = getAWSEnvoriment();

const textractClient = new TextractClient(clientAuths);
const rekognitionClient = new RekognitionClient(clientAuths);

export async function textractIt(base64: string) {
  const matches = regex.exec(base64);
  if (!matches) throw new Error("Invalid base64 image format");
  const buffer = Buffer.from(matches[2], "base64");
  const img = new Uint8Array(buffer);
  const command = new AnalyzeIDCommand({
    DocumentPages: [
      {
        Bytes: img,
      },
    ],
  });
  const data = await textractClient.send(command);
  if (data.IdentityDocuments?.at(0)?.Blocks) {
    return data.IdentityDocuments[0];
  }
}

export async function compareFaces(image: string, image2: string) {
  try {
    const matches1 = regex.exec(image);
    if (!matches1) throw new Error("Invalid base64 image format");
    const buffer1 = Buffer.from(matches1[2], "base64");
    const img1 = new Uint8Array(buffer1);
    const matches2 = regex.exec(image2);
    if (!matches2) throw new Error("Invalid base64 image format");
    const buffer2 = Buffer.from(matches2[2], "base64");
    const img2 = new Uint8Array(buffer2);
    const command = new CompareFacesCommand({
      SourceImage: {Bytes: img1},
      TargetImage: {Bytes: img2},
    });
    const response = await rekognitionClient.send(command);
    const match = response.FaceMatches?.at(0);

    return match?.Similarity ?? 0;
  } catch {
    return 0;
  }
}

export async function detectFace(image: string) {
  try {
    const matches1 = regex.exec(image);
    if (!matches1) throw new Error("Invalid base64 image format");
    const buffer1 = Buffer.from(matches1[2], "base64");
    const img1 = new Uint8Array(buffer1);
    const command = new DetectFacesCommand({
      Image: {Bytes: img1},
      Attributes: ["DEFAULT"],
    });
    const response = await rekognitionClient.send(command);
    const match = response.FaceDetails?.at(0);
    return match?.Confidence ?? 0;
  } catch {
    return 0;
  }
}

export async function createFaceLivenessSession() {
  revalidatePath("");
  const response = await fetch(
    "http://192.168.1.69:44455/api/traveller-service/faceliveness/CreateFaceLivenessSession",
  );
  const data = await response.json();
  return data.sessionId;
}

export async function getFaceLivenessSessionResults(sessionId: string): Promise<{
  isLive: boolean;
  confidence: number;
}> {
  const response = await fetch(
    `http://192.168.1.69:44455/api/traveller-service/faceliveness/GetFaceLivenessSessionResults?sessionId=${sessionId}`,
  );
  const data = await response.json();
  const confidence = data?.confidence || 0;
  return {
    isLive: confidence >= 70,
    confidence: confidence,
  };
}
