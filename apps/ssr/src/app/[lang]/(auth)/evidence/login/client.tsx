"use client";

import {Button} from "@/components/ui/button";
import type {AccountServiceResource} from "@/language-data/core/AccountService";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import {getTenantByNameApi, signInServerApi} from "@repo/actions/core/AccountService/actions";
import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {postCreateEvidenceSessionPublic} from "@repo/actions/unirefund/TravellerService/post-actions";
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import LoginForm from "@repo/ui/theme/auth/login";
import ValidationSteps from "components/validation-steps";
import {IdCard, LogIn} from "lucide-react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useMemo, useState, useEffect} from "react";
import {getResourceData} from "src/language-data/unirefund/SSRService";

interface EvidenceData {
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
  responseCreateEvidence: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;
}

interface LoginClientProps {
  languageData: AccountServiceResource;
  lang: string;
  showRegisterFormOnStart?: boolean;
}

// LoadingSpinner component for better reusability
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
    </div>
  </div>
);

export default function LoginClient({languageData, lang, showRegisterFormOnStart}: LoginClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'den startValidation parametresini al
  const startValidation = searchParams.get("startValidation") === "true";

  const [showLoginForm, setShowLoginForm] = useState(!startValidation);
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null);
  const [clientAuths, setClientAuths] = useState<AWSAuthConfig | null>(null);
  const [evidenceLanguageData, setEvidenceLanguageData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("start");

  // Memoize environment config
  const isTenantDisabled = useMemo(() => process.env.FETCH_TENANT !== "true", []);

  // Memoize require steps to prevent recreation on every render
  const requireSteps = useMemo<UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto>(
    () => ({
      isMRZRequired: true,
      isNFCRequired: false,
      isLivenessRequired: true,
      source: "SSR",
    }),
    [],
  );

  const initializeEvidenceData = useCallback(async () => {
    setLoading(true);

    try {
      const [evidenceResponse, authsResponse, ssrLanguageData] = await Promise.all([
        postCreateEvidenceSessionPublic({requestBody: requireSteps}),
        getAWSEnvoriment(),
        getResourceData(lang),
      ]);

      setEvidenceData({
        requireSteps,
        responseCreateEvidence: evidenceResponse.data as UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
      });
      setClientAuths(authsResponse as AWSAuthConfig);
      setEvidenceLanguageData(ssrLanguageData.languageData as unknown as SSRServiceResource);
    } catch (error) {
      console.error("Error initializing evidence data:", error);
      // You might want to add error handling/display here
    } finally {
      setLoading(false);
    }
  }, [requireSteps, lang]);

  useEffect(() => {
    if (startValidation) {
      // Evidence moduna geçerken verileri yükle
      void initializeEvidenceData();
    }
  }, [startValidation, initializeEvidenceData]);

  // URL parametresi değiştiğinde state'i güncelle
  useEffect(() => {
    setShowLoginForm(!startValidation);
  }, [startValidation]);

  const handleToggle = async () => {
    if (showLoginForm) {
      // Evidence moduna geçerken verileri yükle
      await initializeEvidenceData();
    }
    setShowLoginForm(!showLoginForm);
  };

  // Memoize login text replacement
  const loginTextWithValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.Login}</span>,
        },
      ]),
    [languageData],
  );
  const loginTextWithoutValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithoutValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.Login}</span>,
        },
      ]),
    [languageData],
  );

  // Memoize login text replacement
  const registerTextWithValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.Register}</span>,
        },
      ]),
    [languageData],
  );

  // Determine if toggle button should be shown
  const shouldShowToggleButton = showLoginForm || currentStep === "start";

  // Check if all required data is loaded for ValidationSteps
  const isValidationDataReady = !loading && evidenceData && clientAuths && evidenceLanguageData;

  return (
    <div className="w-full">
      {showLoginForm ? (
        <LoginForm
          isTenantDisabled={isTenantDisabled}
          languageData={languageData}
          onSubmitAction={signInServerApi}
          onTenantSearchAction={getTenantByNameApi}
        />
      ) : (
        <>
          {loading && <LoadingSpinner />}

          {isValidationDataReady && (
            <ValidationSteps
              clientAuths={clientAuths}
              initialStep="start"
              languageData={evidenceLanguageData as SSRServiceResource}
              onStepChange={setCurrentStep}
              requireSteps={evidenceData.requireSteps}
              responseCreateEvidence={evidenceData.responseCreateEvidence}
            />
          )}
        </>
      )}

      {shouldShowToggleButton && (
        <div>
          {showLoginForm ? (
            <div className="mx-auto mb-5 flex w-full flex-col items-center gap-3 px-5 sm:w-[350px]">
              {/* Ayırıcı çizgi ve metin */}
              <div className="flex w-full items-center gap-2">
                <span className="bg-muted h-px min-w-[20px] flex-1"></span>
                <span className="text-muted-foreground max-w-[200px] text-center text-xs uppercase leading-tight">
                  {languageData["Auth.WithDocument"]}
                </span>
                <span className="bg-muted h-px min-w-[20px] flex-1"></span>
              </div>

              {/* Ana kimlik doğrulama butonu */}
              <Button
                disabled={loading}
                className="mt-1 w-full gap-1 shadow-sm"
                type="button"
                onClick={() => {
                  router.push("login?startValidation=true");
                }}>
                <IdCard className="h-5 w-5" />
                {loginTextWithValidation}
              </Button>

              <Button
                onClick={() => {
                  router.push("register?startValidation=true");
                }}
                disabled={loading}
                className="text-muted-foreground w-full gap-1 "
                variant={"outline"}>
                <IdCard className="h-5 w-5" />
                {registerTextWithValidation}
              </Button>
            </div>
          ) : (
            <div>
              {/* Geri dönüş için ayırıcı ve buton */}
              <div className="mt-4 flex w-full items-center gap-2">
                <span className="bg-muted h-px min-w-[20px] flex-1"></span>
                <span className="text-muted-foreground max-w-[200px] text-center text-xs uppercase leading-tight">
                  {languageData["Auth.WithoutDocument"]}
                </span>
                <span className="bg-muted h-px min-w-[20px] flex-1"></span>
              </div>

              <Button
                disabled={loading}
                className="mt-2 w-full gap-1 shadow-sm"
                type="button"
                onClick={() => {
                  router.push("login");
                }}>
                <LogIn className="h-5 w-5" />
                {loginTextWithoutValidation}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
