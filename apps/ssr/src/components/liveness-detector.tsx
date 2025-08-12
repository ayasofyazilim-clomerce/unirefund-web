"use client";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {ThemeProvider, useTheme} from "@aws-amplify/ui-react";
import {FaceLivenessDetectorCore} from "@aws-amplify/ui-react-liveness";
import "@aws-amplify/ui-react/styles.css";
import {
  getApiEvidenceSessionPublicCreateFaceLivenessSession,
  getApiEvidenceSessionPublicGetFaceLivenessSessionResults,
} from "@repo/actions/unirefund/TravellerService/actions";
import {postApiEvidenceSessionLivenessCompareFaces} from "@repo/actions/unirefund/TravellerService/post-actions";
import {useState} from "react";
import OnboardingPage from "./validation-steps/_components/onboarding-liveness";

export default function LivenessDetector({
  languageData,
  evidenceSessionId,
  config,
  onAnalysisComplete,
  frontImageBase64,
}: {
  languageData: SSRServiceResource;
  evidenceSessionId: string;
  config: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  onAnalysisComplete: (result: {isLive: boolean; confidence: number}) => void;
  frontImageBase64: string | null;
}) {
  const [sessionId, setSessionId] = useState<string | null>(null);
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
              if (evidenceSessionId) {
                void getApiEvidenceSessionPublicCreateFaceLivenessSession(evidenceSessionId).then((res) => {
                  if (res.type === "success") {
                    setSessionId(res.data.sessionId || null);
                    ("");
                    setOpen(true); // sadece başarılıysa açık
                  }
                });
              }
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
          {sessionId ? (
            <FaceLivenessDetectorCore
              config={{
                credentialProvider: async () => {
                  await Promise.resolve();
                  return config;
                },
              }}
              disableStartScreen
              onAnalysisComplete={async () => {
                const result = await getApiEvidenceSessionPublicGetFaceLivenessSessionResults(sessionId);
                if (result.type !== "success") {
                  return;
                }

                const confidence = result.data.confidence ?? 0;

                if (confidence > 70 && frontImageBase64) {
                  const compareResult = await postApiEvidenceSessionLivenessCompareFaces({
                    requestBody: {
                      sessionId,
                      sourceImageBase64: frontImageBase64.split(",").at(1),
                    },
                  });
                  if (compareResult.type === "success") {
                    onAnalysisComplete({isLive: true, confidence});
                  } else {
                    onAnalysisComplete({isLive: false, confidence});
                  }
                } else {
                  onAnalysisComplete({isLive: false, confidence});
                }

                setOpen(false);
              }}
              region={config.region}
              sessionId={sessionId}
            />
          ) : null}
        </ThemeProvider>
      </DialogContent>
    </Dialog>
  );
}
