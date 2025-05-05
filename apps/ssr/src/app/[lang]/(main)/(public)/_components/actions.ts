"use server";
import {CompareFacesCommand, DetectFacesCommand, RekognitionClient} from "@aws-sdk/client-rekognition";
import {AnalyzeIDCommand, TextractClient} from "@aws-sdk/client-textract";
/* eslint prefer-named-capture-group: off -- We need to disable this rule */
const regex = /^data:(.+);base64,(.+)$/;
const clientAuths = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};
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
  // console.log("DATA", data.IdentityDocuments);
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
  } catch (error) {
    // console.error("AWS Rekognition error:", error);
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
  } catch (error) {
    // console.error("AWS Rekognition error:", error);
    return 0;
  }
}
