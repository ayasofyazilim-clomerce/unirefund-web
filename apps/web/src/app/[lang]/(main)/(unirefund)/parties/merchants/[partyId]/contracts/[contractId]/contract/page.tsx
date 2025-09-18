import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getMerchantContractHeaderByIdApi,
  getRefundTableHeadersAssignablesByMerchantIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getMerchantAddressesByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {structuredError} from "@repo/utils/api";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {MerchantContractHeaderUpdateForm} from "./_components/form";

async function getApiRequests(partyId: string, contractId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getRefundTableHeadersAssignablesByMerchantIdApi({
        merchantId: partyId,
      }),

      getMerchantContractHeaderByIdApi(contractId),
      getMerchantAddressesByIdApi(partyId, session),
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
      "ContractService.ContractHeaderForMerchant.ViewDetail",
      "ContractService.RefundTableHeader.GetAssignablesByMerchantId",
    ],
    lang,
    redirect: false,
  });
  const apiRequests = await getApiRequests(partyId, contractId);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [
    refundTableHeadersResponse,
    // otherContractHeadersResponse,
    contractHeaderDetailsResponse,
    addressListResponse,
  ] = apiRequests.requiredRequests;

  // const contractHeaders = otherContractHeadersResponse.data.items;
  // const activeContract = contractHeaders?.find((i) => i.isActive === true);

  return (
    <MerchantContractHeaderUpdateForm
      addressList={addressListResponse.data}
      contractHeaderDetails={contractHeaderDetailsResponse.data}
      languageData={languageData}
      refundTableHeaders={refundTableHeadersResponse.data}
    />
  );
}
