import { notFound } from "next/navigation";
import {
  getRefundTableHeadersApi,
  getRefundFeeHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import {
  getAdressesApi,
  getMerchantByIdApi,
  getRefundPointDetailsByIdApi,
} from "src/actions/unirefund/CrmService/actions";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getBaseLink } from "src/utils";
import MerchantContractHeaderForm from "../_components/contract-header-form/merchant";
import RefundPointContractHeaderForm from "../_components/contract-header-form/refund-point";
import type { ContractPartyName } from "../_components/types";

export default async function Page({
  params,
}: {
  params: {
    partyName: ContractPartyName;
    partyId: string;
    lang: string;
  };
}) {
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.Create"],
    lang: params.lang,
  });

  const { languageData } = await getResourceData(params.lang);
  if (params.partyName === "merchants") {
    const addresses = await getAdressesApi(params.partyId, params.partyName);
    const refundTableHeaders = await getRefundTableHeadersApi({});
    const merchantDetails = await getMerchantByIdApi(params.partyId);
    if (
      addresses.type !== "success" ||
      refundTableHeaders.type !== "success" ||
      merchantDetails.type !== "success"
    ) {
      return notFound();
    }
    return (
      <>
        <MerchantContractHeaderForm
          addresses={addresses.data}
          formType="create"
          languageData={languageData}
          loading={false}
          refundTableHeaders={refundTableHeaders.data.items || []}
        />
        <PageHeader
          languageData={languageData}
          params={params}
          title={merchantDetails.data.name}
        />
      </>
    );
  }

  const refundPointDetails = await getRefundPointDetailsByIdApi(params.partyId);
  const refundFeeHeaders = await getRefundFeeHeadersApi({});
  if (
    refundPointDetails.type !== "success" ||
    refundFeeHeaders.type !== "success"
  )
    return notFound();

  const refundPointDetailsSummary = refundPointDetails.data.entityInformations
    ?.at(0)
    ?.organizations?.at(0);
  return (
    <>
      <RefundPointContractHeaderForm
        addresses={
          refundPointDetailsSummary?.contactInformations?.at(0)?.addresses || []
        }
        formData={{
          validFrom: new Date().toISOString(),
          validTo: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ).toISOString(),
          refundFeeHeaders: [],
          addressCommonDataId:
            refundPointDetailsSummary?.contactInformations
              ?.at(0)
              ?.addresses?.at(0)?.id || "00000000-0000-0000-0000-000000000000",
          merchantClassification: "Low",
        }}
        formType="create"
        languageData={languageData}
        loading={false}
        refundFeeHeaders={refundFeeHeaders.data.items || []}
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
  params: { partyName: string; partyId: string };
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
        {getBaseLink(`/parties/${params.partyName}/${params.partyId}`)}
      </div>
    </>
  );
}
