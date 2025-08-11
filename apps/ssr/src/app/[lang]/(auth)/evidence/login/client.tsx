"use client";

import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import {getTenantByNameApi, signInServerApi} from "@repo/actions/core/AccountService/actions";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {postCreateEvidenceSessionPublic} from "@repo/actions/unirefund/TravellerService/post-actions";
import LoginForm from "@repo/ui/theme/auth/login";
import {useState} from "react";
import ValidationSteps from "components/validation-steps";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import type {AccountServiceResource} from "@/language-data/core/AccountService";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
interface EvidenceData {
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
  responseCreateEvidence: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;
}

interface LoginClientProps {
  languageData: AccountServiceResource;
  lang: string;
}

export default function LoginClient({languageData, lang}: LoginClientProps) {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null);
  const [clientAuths, setClientAuths] = useState<AWSAuthConfig | null>(null);
  const [evidenceLanguageData, setEvidenceLanguageData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("start");
  const isTenantDisabled = process.env.FETCH_TENANT !== "true";

  const initializeEvidenceData = async () => {
    setLoading(true);

    const requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto = {
      isMRZRequired: true,
      isNFCRequired: false,
      isLivenessRequired: true,
      source: "SSR",
    };

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

    setLoading(false);
  };

  const handleToggle = async () => {
    if (showLoginForm) {
      // Evidence moduna geçerken verileri yükle
      await initializeEvidenceData();
    }
    setShowLoginForm(!showLoginForm);
  };

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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
              </div>
            </div>
          ) : null}

          {!loading && evidenceData && clientAuths && evidenceLanguageData ? (
            <ValidationSteps
              clientAuths={clientAuths}
              initialStep="start"
              languageData={evidenceLanguageData as SSRServiceResource}
              onStepChange={setCurrentStep}
              requireSteps={evidenceData.requireSteps}
              responseCreateEvidence={evidenceData.responseCreateEvidence}
            />
          ) : null}
        </>
      )}

      {/* Show toggle button only when on login form or on start step */}
      {showLoginForm || currentStep === "start" ? (
        <div className="mt-2 flex flex-col items-center gap-2">
          <button
            className={`border-none bg-transparent p-0 text-sm text-gray-600 transition-colors hover:text-gray-900 ${
              loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            disabled={loading}
            onClick={() => {
              if (!loading) {
                void handleToggle();
              }
            }}
            type="button">
            {showLoginForm ? (
              <>
                {replacePlaceholders(languageData["Auth.{0}.WithValidation"], [
                  {
                    holder: "{0}",
                    replacement: <span className="text-primary font-medium">{languageData.Login}</span>,
                  },
                ])}
              </>
            ) : (
              <>
                {replacePlaceholders(languageData["Auth.{0}.WithValidation"], [
                  {
                    holder: "{0}",
                    replacement: <span className="text-primary font-medium">{languageData.Login}</span>,
                  },
                ])}
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
