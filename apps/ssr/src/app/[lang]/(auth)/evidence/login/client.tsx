"use client";

import {getTenantByNameApi, signInServerApi} from "@repo/actions/core/AccountService/actions";
import LoginForm from "@repo/ui/theme/auth/login";
import type {AccountServiceResource} from "@/language-data/core/AccountService";
import {useEvidenceValidation, EvidenceValidationWrapper, ValidationToggleButtons, useAuthTexts} from "../index";

interface LoginClientProps {
  languageData: AccountServiceResource;
  lang: string;
}

export default function LoginClient({languageData, lang}: LoginClientProps) {
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

  const {loginTextWithValidation, loginTextWithoutValidation, registerTextWithValidation} = useAuthTexts(languageData);

  return (
    <div className="w-full">
      {showMainForm ? (
        <LoginForm
          isTenantDisabled={isTenantDisabled}
          languageData={languageData}
          onSubmitAction={signInServerApi}
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
        alternativeActionText={registerTextWithValidation}
        alternativePath="register"
        currentStep={currentStep}
        languageData={languageData}
        loading={loading}
        mainActionText={loginTextWithValidation}
        mainActionWithoutValidationText={loginTextWithoutValidation}
        mainPath="login"
        showMainForm={showMainForm}
      />
    </div>
  );
}
