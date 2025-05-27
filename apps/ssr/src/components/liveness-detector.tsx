"use client";
import type {FaceLivenessDetectorProps} from "@aws-amplify/ui-react-liveness";
import {FaceLivenessDetectorCore} from "@aws-amplify/ui-react-liveness";
import "@aws-amplify/ui-react/styles.css";
import {ThemeProvider, useTheme} from "@aws-amplify/ui-react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {useState} from "react";
import {getFaceLiveness} from "@repo/actions/unirefund/TravellerService/actions";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import OnboardingPage from "./validation-steps/_components/onboarding-liveness";

export default function LivenessDetector({
  languageData,
  sessionId,
  config,
  onAnalysisComplete,
  onError,
}: {
  languageData: SSRServiceResource;
  sessionId: string;
  config: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  onAnalysisComplete: (result: {isLive: boolean; confidence: number}) => void;
  onError: FaceLivenessDetectorProps["onError"];
}) {
  // Amplify'ın default token'larını alıyoruz
  const {tokens} = useTheme();
  // Kendi temamızı tanımlıyoruz
  const theme = {
    name: "CustomFaceLivenessTheme",
    tokens: {
      colors: {
        background: {
          primary: {value: tokens.colors.neutral["90"].value},
          secondary: {value: tokens.colors.neutral["100"].value},
        },
        font: {
          primary: {value: tokens.colors.white.value},
        },
        brand: {
          primary: {
            "10": tokens.colors.blue["90"].value,
            "80": tokens.colors.blue["40"].value,
            "90": tokens.colors.blue["20"].value,
            "100": tokens.colors.blue["10"].value,
          },
        },
      },
    },
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <div>
          <OnboardingPage
            languageData={languageData}
            onStartValidation={() => {
              setOpen(true);
            }}
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex h-full max-h-screen min-h-screen w-full w-full max-w-2xl max-w-full items-center justify-center rounded-none border-none 
                   bg-transparent 
                   p-0 p-6 shadow-none sm:h-auto sm:w-auto 
                   sm:max-w-[425px] sm:rounded-lg">
        <ThemeProvider theme={theme}>
          <FaceLivenessDetectorCore
            config={{
              credentialProvider: async () => {
                await Promise.resolve();
                return config;
              },
            }}
            disableStartScreen
            onAnalysisComplete={async () => {
              const result = await getFaceLiveness(sessionId);
              if (result.type === "success") {
                onAnalysisComplete({
                  isLive: (result.data.confidence ?? 0) > 70,
                  confidence: result.data.confidence ?? 0,
                });

                setOpen(false);
              }
            }}
            onError={onError}
            region={config.region}
            sessionId={sessionId}
          />
        </ThemeProvider>
      </DialogContent>
    </Dialog>
  );
}
