import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getMerchantContractHeaderByIdApi,
  // getMerchantContractHeadersByMerchantIdApi,
  getRefundTableHeadersAssignablesByMerchantIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getMerchantAddressByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {MerchantContractHeaderUpdateForm} from "./_components/form";

async function getApiRequests(partyId: string, contractId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundTableHeadersAssignablesByMerchantIdApi({
        merchantId: partyId,
      }),
      // getMerchantContractHeadersByMerchantIdApi({
      //   id: partyId,
      //   isDraft: false,
      // }),
      getMerchantContractHeaderByIdApi(contractId),
      getMerchantAddressByIdApi(partyId, session),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
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
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.Edit"],
    lang,
  });
  const apiRequests = await getApiRequests(partyId, contractId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [
    refundTableHeadersResponse,
    // otherContractHeadersResponse,
    contractHeaderDetailsResponse,
    addressListResponse,
  ] = apiRequests.data;

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
