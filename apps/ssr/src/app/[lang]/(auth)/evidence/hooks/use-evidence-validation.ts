"use client";

import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {postCreateEvidenceSessionPublic} from "@repo/actions/unirefund/TravellerService/post-actions";
import {useSearchParams} from "next/navigation";
import {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "@/components/ui/sonner";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {getResourceData} from "src/language-data/unirefund/SSRService";

interface EvidenceData {
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
  responseCreateEvidence: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;
}

interface UseEvidenceValidationReturn {
  // State
  showMainForm: boolean;
  evidenceData: EvidenceData | null;
  clientAuths: AWSAuthConfig | null;
  evidenceLanguageData: SSRServiceResource | null;
  loading: boolean;
  currentStep: string;
  startValidation: boolean;

  // Computed
  isValidationDataReady: boolean;
  isTenantDisabled: boolean;

  // Handlers
  setCurrentStep: (step: string) => void;
}

export function useEvidenceValidation(lang: string): UseEvidenceValidationReturn {
  const searchParams = useSearchParams();

  // URL'den startValidation parametresini al
  const startValidation = searchParams.get("startValidation") === "true";

  const [showMainForm, setShowMainForm] = useState(!startValidation);
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null);
  const [clientAuths, setClientAuths] = useState<AWSAuthConfig | null>(null);
  const [evidenceLanguageData, setEvidenceLanguageData] = useState<SSRServiceResource | null>(null);
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
      setEvidenceLanguageData(ssrLanguageData.languageData as SSRServiceResource);
    } catch (error) {
      toast.error(String(error));
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
    setShowMainForm(!startValidation);
  }, [startValidation]);

  // Check if all required data is loaded for ValidationSteps
  const isValidationDataReady =
    !loading && Boolean(evidenceData) && Boolean(clientAuths) && Boolean(evidenceLanguageData);

  return {
    showMainForm,
    evidenceData,
    clientAuths,
    evidenceLanguageData,
    loading,
    currentStep,
    startValidation,
    isValidationDataReady,
    isTenantDisabled,
    setCurrentStep,
  };
}
