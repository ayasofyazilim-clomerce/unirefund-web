"use client";
import type {FaceLivenessDetectorProps} from "@aws-amplify/ui-react-liveness";
import {FaceLivenessDetectorCore} from "@aws-amplify/ui-react-liveness";
import {getFaceLivenessSessionResults} from "@repo/actions/unirefund/AWSService/actions";

export default function LivenessDetector({
  sessionId,
  config,
  onAnalysisComplete,
  onError,
}: {
  sessionId: string;
  config: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  onAnalysisComplete: (result: {isLive: boolean; confidence: number}) => void;
  onError: FaceLivenessDetectorProps["onError"];
}) {
  return (
    <FaceLivenessDetectorCore
      config={{
        credentialProvider: async () => {
          await Promise.resolve();
          return config;
        },
      }}
      disableStartScreen
      onAnalysisComplete={async () => {
        const result = await getFaceLivenessSessionResults(sessionId);
        onAnalysisComplete(result);
      }}
      onError={onError}
      region={config.region}
      sessionId={sessionId}
    />
  );
}
