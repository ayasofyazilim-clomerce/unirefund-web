import { auth } from "@repo/utils/auth/next-auth";
import {
  getMerchantContractHeadersByMerchantIdApi,
  getRefundTableHeadersAssignablesByMerchantIdApi,
} from "src/actions/unirefund/ContractService/action";
import { getMerchantAddressByIdApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import MerchantContractHeaderForm from "../_components/contact-header-form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantAddressByIdApi(partyId, session),
      getMerchantContractHeadersByMerchantIdApi(
        {
          id: partyId,
          isDraft: false,
        },
        session,
      ),
      getRefundTableHeadersAssignablesByMerchantIdApi(
        {
          merchantId: partyId,
        },
        session,
      ),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
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
    partyId: string;
    lang: string;
  };
}) {
  const { partyId, lang } = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.Create"],
    lang,
  });

  const { languageData } = await getResourceData(lang);
  const apiRequests = await getApiRequests(partyId);
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }
  const [
    addressListResponse,
    otherContractHeadersResponse,
    refundTableHeadersResponse,
  ] = apiRequests.data;

  const biggestContractHeader = otherContractHeadersResponse.data.items?.at(0);
  return (
    <MerchantContractHeaderForm
      addresses={addressListResponse.data}
      formType="create"
      fromDate={
        biggestContractHeader
          ? new Date(biggestContractHeader.validTo)
          : undefined
      }
      languageData={languageData}
      loading={false}
      refundTableHeaders={refundTableHeadersResponse.data}
    />
  );
}
