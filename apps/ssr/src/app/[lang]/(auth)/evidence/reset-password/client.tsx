"use client";

import {
  getTenantByNameApi,
  resetPasswordApi,
  sendPasswordResetCodeApi,
} from "@repo/actions/core/AccountService/actions";
import NewPasswordForm from "@repo/ui/theme/auth/new-password";
import ResetPasswordForm from "@repo/ui/theme/auth/reset-password";
import type {AccountServiceResource} from "@/language-data/core/AccountService";
import {
  useEvidenceValidation,
  usePasswordReset,
  EvidenceValidationWrapper,
  ValidationToggleButtons,
  useAuthTexts,
} from "../index";

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
  const {userId, resetToken, tenantId} = usePasswordReset({searchParams, lang});

  const {
    showMainForm,
    evidenceData,
    clientAuths,
    evidenceLanguageData,
    loading,
    currentStep,
    isValidationDataReady,
    isTenantDisabled,
    setCurrentStep,
  } = useEvidenceValidation(lang);

  const {resetPasswordTextWithValidation, resetPasswordTextWithoutValidation} = useAuthTexts(languageData);

  // If userId and resetToken are present, show NewPasswordForm directly
  if (userId && resetToken) {
    return (
      <NewPasswordForm
        languageData={languageData}
        onSubmitAction={resetPasswordApi}
        resetToken={resetToken}
        tenantId={tenantId || ""}
        userId={userId}
      />
    );
  }

  return (
    <div className="w-full">
      {showMainForm ? (
        <ResetPasswordForm
          isTenantDisabled={isTenantDisabled}
          languageData={languageData}
          onSubmitAction={sendPasswordResetCodeApi}
          onTenantSearchAction={getTenantByNameApi}
        />
      ) : (
        <EvidenceValidationWrapper
          clientAuths={clientAuths}
          evidenceData={evidenceData}
          evidenceLanguageData={evidenceLanguageData}
          isValidationDataReady={isValidationDataReady}
          loading={loading}
          onStepChange={setCurrentStep}
        />
      )}

      <ValidationToggleButtons
        currentStep={currentStep}
        languageData={languageData}
        loading={loading}
        mainActionText={resetPasswordTextWithValidation}
        mainActionWithoutValidationText={resetPasswordTextWithoutValidation}
        mainPath="reset-password"
        showMainForm={showMainForm}
      />
    </div>
  );
}
