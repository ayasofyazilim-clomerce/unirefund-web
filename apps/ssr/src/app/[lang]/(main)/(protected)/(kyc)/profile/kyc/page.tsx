import {Card} from "@/components/ui/card";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {postCreateEvidenceSession} from "@repo/actions/unirefund/TravellerService/post-actions";
import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import type {
  PostApiTravellerServicePublicEvidenceSessionsData,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import ErrorComponent from "@repo/ui/components/error-component";
import ValidationSteps from "components/validation-steps";
import {getResourceData} from "src/language-data/unirefund/SSRService";

async function getApiRequests(reqSteps: PostApiTravellerServicePublicEvidenceSessionsData = {}) {
  try {
    const requiredRequests = await Promise.all([postCreateEvidenceSession(reqSteps)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  // Define required steps for KYC page
  const requireSteps = {
    isMRZRequired: false,
    isNFCRequired: false,
    isLivenessRequired: true,
  };

  const apiRequests = await getApiRequests({requireSteps} as PostApiTravellerServicePublicEvidenceSessionsData);
  const clientAuths = await getAWSEnvoriment(); // Define the properly-typed evidence response based on the ValidationSteps component requirements

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [responseCreateEvidence] = apiRequests.requiredRequests;
  const data = responseCreateEvidence.data as UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;

  return (
    <Card className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-md md:mx-auto md:max-w-xl">
      <ValidationSteps
        clientAuths={clientAuths}
        languageData={languageData}
        requireSteps={requireSteps}
        responseCreateEvidence={data}
      />
    </Card>
  );
}
