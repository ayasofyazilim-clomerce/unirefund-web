"use client";

import {getTenantByNameApi, signUpServerApi} from "@repo/actions/core/AccountService/actions";
import RegisterForm from "@repo/ui/theme/auth/register";
import type {AccountServiceResource} from "@/language-data/core/AccountService";
import {useEvidenceValidation, EvidenceValidationWrapper, ValidationToggleButtons, useAuthTexts} from "../index";

interface RegisterClientProps {
  languageData: AccountServiceResource;
  lang: string;
}

export default function RegisterClient({languageData, lang}: RegisterClientProps) {
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

  const {registerTextWithValidation, registerTextWithoutValidation, loginTextWithValidation} =
    useAuthTexts(languageData);

  return (
    <div className="w-full">
      {showMainForm ? (
        <RegisterForm
          isTenantDisabled={isTenantDisabled}
          languageData={languageData}
          onSubmitAction={signUpServerApi}
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
        alternativeActionText={loginTextWithValidation}
        alternativePath="login"
        currentStep={currentStep}
        languageData={languageData}
        loading={loading}
        mainActionText={registerTextWithValidation}
        mainActionWithoutValidationText={registerTextWithoutValidation}
        mainPath="register"
        showMainForm={showMainForm}
      />
    </div>
  );
}
