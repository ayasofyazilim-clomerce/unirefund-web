import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getRefundFeeHeadersAssignablesByRefundPointIdApi,
  getRefundPointContractHeaderByIdApi,
  // getRefundPointContractHeadersByRefundPointIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getRefundPointDetailsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import RefundPointContractHeaderUpdateForm from "./_components/form";

async function getApiRequests(partyId: string, contractId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundFeeHeadersAssignablesByRefundPointIdApi(
        {
          refundPointId: partyId,
        },
        session,
      ),
      getRefundPointContractHeaderByIdApi(contractId, session),
      getRefundPointDetailsByIdApi(partyId, session),
      // getRefundPointContractHeadersByRefundPointIdApi(
      //   {
      //     id: partyId,
      //     isDraft: false,
      //   },
      //   session,
      // ),
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
    requiredPolicies: [
      "ContractService.ContractHeaderForRefundPoint.Detail",
      "ContractService.RefundFeeHeader.GetAssignablesByRefundPointId",
    ],
    lang,
  });

  const apiRequests = await getApiRequests(partyId, contractId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [
    refundFeeHeadersResponse,
    contractHeaderDetailsResponse,
    refundPointDetailsResponse,
    // otherContractHeadersResponse,
  ] = apiRequests.data;

  const refundPointDetailsSummary = refundPointDetailsResponse.data.entityInformations?.at(0)?.organizations?.at(0);

  // const contractHeaders = otherContractHeadersResponse.data.items;

  return (
    <RefundPointContractHeaderUpdateForm
      addressList={refundPointDetailsSummary?.contactInformations?.at(0)?.addresses || []}
      contractHeaderDetails={contractHeaderDetailsResponse.data}
      languageData={languageData}
      refundFeeHeaders={refundFeeHeadersResponse.data}
    />
  );
}
