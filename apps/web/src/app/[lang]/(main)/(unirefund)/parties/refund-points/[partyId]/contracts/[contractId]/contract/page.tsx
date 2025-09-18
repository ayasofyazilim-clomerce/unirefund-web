import {
  getRefundFeeHeadersAssignablesByRefundPointIdApi,
  getRefundPointContractHeaderByIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getRefundPointAddressesByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import RefundPointContractHeaderUpdateForm from "./_components/form";

async function getApiRequests(partyId: string, contractId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getRefundFeeHeadersAssignablesByRefundPointIdApi(
        {
          refundPointId: partyId,
        },
        session,
      ),
      getRefundPointContractHeaderByIdApi(contractId, session),
      getRefundPointAddressesByIdApi(partyId, session),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
    contractId: string;
  };
}) {
  const {lang, partyId, contractId} = params;
  const {languageData} = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractHeaderForRefundPoint.Detail",
      "ContractService.RefundFeeHeader.GetAssignablesByRefundPointId",
    ],
    lang,
  });

  const apiRequests = await getApiRequests(partyId, contractId);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [refundFeeHeadersResponse, contractHeaderDetailsResponse, refundPointAddresses] = apiRequests.requiredRequests;

  return (
    <RefundPointContractHeaderUpdateForm
      addressList={refundPointAddresses.data}
      contractHeaderDetails={contractHeaderDetailsResponse.data}
      languageData={languageData}
      refundFeeHeaders={refundFeeHeadersResponse.data}
    />
  );
}
