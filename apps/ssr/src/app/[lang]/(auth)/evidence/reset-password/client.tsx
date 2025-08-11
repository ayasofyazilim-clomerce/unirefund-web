"use client";

import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import {
  getTenantByNameApi,
  resetPasswordApi,
  sendPasswordResetCodeApi,
  verifyPasswordResetTokenApi,
} from "@repo/actions/core/AccountService/actions";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {postCreateEvidenceSessionPublic} from "@repo/actions/unirefund/TravellerService/post-actions";
import NewPasswordForm from "@repo/ui/theme/auth/new-password";
import ResetPasswordForm from "@repo/ui/theme/auth/reset-password";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import ValidationSteps from "components/validation-steps";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import type {AccountServiceResource} from "@/language-data/core/AccountService";
import {getResourceData} from "src/language-data/core/AccountService";
import {getBaseLink} from "src/utils";

interface EvidenceData {
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
  responseCreateEvidence: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;
}

interface PasswordClientProps {
  languageData: AccountServiceResource;
  lang: string;
  searchParams: {
    userId?: string;
    resetToken?: string;
    tenantId?: string;
  };
}

export default function PasswordClient({languageData, lang, searchParams}: PasswordClientProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(true);
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null);
  const [clientAuths, setClientAuths] = useState<AWSAuthConfig | null>(null);
  const [evidenceLanguageData, setEvidenceLanguageData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("start");
  const isTenantDisabled = process.env.FETCH_TENANT !== "true";

  // Extract userId and resetToken from query params (if available)
  let userId: string | undefined;
  let resetToken: string | undefined;
  let __tenant: string | undefined;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get("userId") || undefined;
    resetToken = urlParams.get("resetToken") || undefined;
    __tenant = urlParams.get("tenantId") || undefined;
  }

  useEffect(() => {
    async function verifyToken() {
      if (searchParams.userId && searchParams.resetToken) {
        const verifyPasswordResetTokenResponse = await verifyPasswordResetTokenApi({
          userId: searchParams.userId,
          resetToken: searchParams.resetToken,
          tenantId: searchParams.tenantId || "",
        });
        if (verifyPasswordResetTokenResponse.type !== "success" || !verifyPasswordResetTokenResponse.data) {
          return redirect(getBaseLink("/login?error=invalidToken", lang));
        }
      }
    }
    void verifyToken();
  }, [userId, resetToken, __tenant, lang]);

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
    if (showPasswordForm) {
      // Evidence moduna geçerken verileri yükle
      await initializeEvidenceData();
    }
    setShowPasswordForm(!showPasswordForm);
  };

  // If userId and resetToken are present and token is verified, show NewPasswordForm
  if (userId && resetToken) {
    return (
      <NewPasswordForm
        languageData={languageData}
        onSubmitAction={resetPasswordApi}
        resetToken={resetToken}
        tenantId={__tenant || ""}
        userId={userId}
      />
    );
  }

  return (
    <div className="w-full">
      {showPasswordForm ? (
        <ResetPasswordForm
          isTenantDisabled={isTenantDisabled}
          languageData={languageData}
          onSubmitAction={sendPasswordResetCodeApi}
          onTenantSearchAction={getTenantByNameApi}
        />
      ) : (
        <>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                <p>Evidence verileri yükleniyor...</p>
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

      {/* Show toggle button only when on password form or on start step */}
      {showPasswordForm || currentStep === "start" ? (
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
            {showPasswordForm ? (
              <>
                Doğrulama yaparak <span className="text-primary font-medium">şifremi sıfırlamak</span> istiyorum!
              </>
            ) : (
              <>
                Doğrulama yapmadan <span className="text-primary font-medium">şifremi sıfırlamak</span> istiyorum!
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
