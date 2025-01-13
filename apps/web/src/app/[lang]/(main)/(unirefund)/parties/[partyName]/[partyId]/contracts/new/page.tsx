import {
  getMerchantContractHeadersByMerchantIdApi,
  getRefundFeeHeadersApi,
  getRefundPointContractHeadersByRefundPointIdApi,
  getRefundTableHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import {
  getAdressesApi,
  getMerchantByIdApi,
  getRefundPointDetailsByIdApi,
} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getBaseLink } from "src/utils";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
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
  const { partyName, partyId, lang } = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.Create"],
    lang,
  });

  const { languageData } = await getResourceData(lang);
  if (partyName === "merchants") {
    const addresses = await getAdressesApi(partyId, partyName);
    if (isErrorOnRequest(addresses, lang)) return;
    const refundTableHeaders = await getRefundTableHeadersApi({});
    if (isErrorOnRequest(refundTableHeaders, lang)) return;
    const merchantDetails = await getMerchantByIdApi(partyId);
    if (isErrorOnRequest(merchantDetails, lang)) return;
    const otherContractHeaders =
      await getMerchantContractHeadersByMerchantIdApi({
        id: partyId,
        sorting: "validTo desc",
      });
    if (isErrorOnRequest(otherContractHeaders, lang)) return;

    const biggestContractHeader = otherContractHeaders.data.items?.at(0);
    return (
      <>
        <MerchantContractHeaderForm
          addresses={addresses.data}
          formType="create"
          fromDate={
            biggestContractHeader
              ? new Date(biggestContractHeader.validTo)
              : undefined
          }
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
  const refundPointDetailsResponse =
    await getRefundPointDetailsByIdApi(partyId);
  if (isErrorOnRequest(refundPointDetailsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={refundPointDetailsResponse.message}
      />
    );
  }

  const refundFeeHeadersResponse = await getRefundFeeHeadersApi({});
  if (isErrorOnRequest(refundFeeHeadersResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={refundFeeHeadersResponse.message}
      />
    );
  }

  const otherContractHeaders =
    await getRefundPointContractHeadersByRefundPointIdApi({
      id: partyId,
      sorting: "validTo desc",
    });
  if (isErrorOnRequest(otherContractHeaders, lang)) return;
  const refundPointDetailsSummary =
    refundPointDetailsResponse.data.entityInformations
      ?.at(0)
      ?.organizations?.at(0);
  const biggestContractHeader = otherContractHeaders.data.items?.at(0);

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
        fromDate={
          biggestContractHeader
            ? new Date(biggestContractHeader.validTo)
            : new Date()
        }
        languageData={languageData}
        loading={false}
        refundFeeHeaders={refundFeeHeadersResponse.data.items || []}
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
