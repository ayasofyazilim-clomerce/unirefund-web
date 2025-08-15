import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import ValidationSteps from "components/validation-steps";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {LoadingSpinner} from "./SharedComponents";

interface EvidenceValidationWrapperProps {
  loading: boolean;
  isValidationDataReady: boolean;
  clientAuths: AWSAuthConfig | null;
  evidenceLanguageData: SSRServiceResource | null;
  evidenceData: {
    requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
    responseCreateEvidence: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;
  } | null;
  onStepChange: (step: string) => void;
}

export function EvidenceValidationWrapper({
  loading,
  isValidationDataReady,
  clientAuths,
  evidenceLanguageData,
  evidenceData,
  onStepChange,
}: EvidenceValidationWrapperProps) {
  return (
    <>
      {loading ? <LoadingSpinner /> : null}

      {isValidationDataReady && clientAuths && evidenceLanguageData && evidenceData ? (
        <ValidationSteps
          clientAuths={clientAuths}
          initialStep="start"
          languageData={evidenceLanguageData}
          onStepChange={onStepChange}
          requireSteps={evidenceData.requireSteps}
          responseCreateEvidence={evidenceData.responseCreateEvidence}
        />
      ) : null}
    </>
  );
}
