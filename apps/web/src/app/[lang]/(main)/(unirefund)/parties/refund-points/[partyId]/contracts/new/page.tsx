import { auth } from "@repo/utils/auth/next-auth";
import { isUnauthorized } from "@repo/utils/policies";
import {
  getRefundFeeHeadersAssignablesByRefundPointIdApi,
  // getRefundPointContractHeadersByRefundPointIdApi,
} from "src/actions/unirefund/ContractService/action";
import { getRefundPointDetailsByIdApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getBaseLink } from "src/utils";
// import RefundPointContractHeaderForm from "../_components/contract-header-form";
import RefundPointContractHeaderCreateForm from "./_components/form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundPointDetailsByIdApi(partyId, session),
      getRefundFeeHeadersAssignablesByRefundPointIdApi(
        {
          refundPointId: partyId,
          sorting: "name",
        },
        session,
      ),
      // getRefundPointContractHeadersByRefundPointIdApi(
      //   {
      //     id: partyId,
      //     sorting: "validTo desc",
      //   },
      //   session,
      // ),
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
    refundPointDetailsResponse,
    refundFeeHeadersResponse,
    // otherContractHeaders,
  ] = apiRequests.data;

  const refundPointDetailsSummary =
    refundPointDetailsResponse.data.entityInformations
      ?.at(0)
      ?.organizations?.at(0);
  // const biggestContractHeader = otherContractHeaders.data.items?.at(0);

  return (
    <>
      <RefundPointContractHeaderCreateForm
        addressList={
          refundPointDetailsSummary?.contactInformations?.at(0)?.addresses || []
        }
        languageData={languageData}
        refundFeeHeaders={refundFeeHeadersResponse.data}
      />
      <PageHeader
        languageData={languageData}
        params={params}
        title={refundPointDetailsSummary?.name || ""}
      />
    </>
  );
}

function PageHeader({
  params,
  title,
  languageData,
}: {
  params: { partyId: string };
  title: string;
  languageData: ContractServiceResource;
}) {
  return (
    <>
      <div className="hidden" id="page-title">
        {languageData["Contracts.Create.Title"]} - {title}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Contracts.Create.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`/parties/refund-points/${params.partyId}`)}
      </div>
    </>
  );
}
