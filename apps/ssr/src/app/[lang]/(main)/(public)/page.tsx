import {Card} from "@/components/ui/card";
import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {postCreateEvidenceSession} from "@repo/actions/unirefund/TravellerService/post-actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {redirect} from "next/navigation";
import ValidationSteps from "components/validation-steps";
import {getBaseLink} from "@/utils";
import {getResourceData} from "src/language-data/unirefund/SSRService";

async function getApiRequests(reqSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto = {}) {
  try {
    const requiredRequests = await Promise.all([postCreateEvidenceSession({requestBody: reqSteps})]);
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
  const requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto = {
    isMRZRequired: false,
    isNFCRequired: false,
    isLivenessRequired: true,
  };
  const apiRequests = await getApiRequests(requireSteps);
  const clientAuths = await getAWSEnvoriment();
  const session = await auth();

  if (session) {
    redirect(getBaseLink("home", lang));
  }

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
