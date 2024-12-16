import {
  getRefundPointDetailsByIdApi,
  getAdressesApi,
} from "src/actions/unirefund/CrmService/actions";
import {
  getMerchantContractHeaderByIdApi,
  getRefundFeeHeadersApi,
  getRefundPointContractHeaderById,
  getRefundTableHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import type { ContractPartyName } from "../../_components/types";
import { ContractHeader as RefundPointContractHeader } from "./_components/refund-point";
import { ContractHeader as MerchantContractHeader } from "./_components/merchant";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyName: ContractPartyName;
    partyId: string;
    contractId: string;
  };
}) {
  const { lang, partyName, partyId, contractId } = params;
  const { languageData } = await getResourceData(lang);
  if (partyName === "merchants") {
    await isUnauthorized({
      requiredPolicies: ["ContractService.ContractHeaderForMerchant.Edit"],
      lang,
    });
    const refundTableHeaders = await getRefundTableHeadersApi({});
    if (isErrorOnRequest(refundTableHeaders, lang)) return;
    const contractHeaderDetails =
      await getMerchantContractHeaderByIdApi(contractId);
    if (isErrorOnRequest(contractHeaderDetails, lang)) return;
    const addressList = await getAdressesApi(partyId, partyName);
    if (isErrorOnRequest(addressList, lang)) return;

    return (
      <MerchantContractHeader
        addressList={addressList.data}
        contractHeaderDetails={contractHeaderDetails.data}
        languageData={languageData}
        refundTableHeaders={refundTableHeaders.data.items || []}
      />
    );
  }

  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForRefundPoint.Edit"],
    lang,
  });
  const refundFeeHeaders = await getRefundFeeHeadersApi({});
  if (isErrorOnRequest(refundFeeHeaders, lang)) return;
  const contractHeaderDetails =
    await getRefundPointContractHeaderById(contractId);
  if (isErrorOnRequest(contractHeaderDetails, lang)) return;
  const refundPointDetails = await getRefundPointDetailsByIdApi(params.partyId);
  if (isErrorOnRequest(refundPointDetails, lang)) return;
  const refundPointDetailsSummary = refundPointDetails.data.entityInformations
    ?.at(0)
    ?.organizations?.at(0);
  return (
    <RefundPointContractHeader
      addressList={
        refundPointDetailsSummary?.contactInformations?.at(0)?.addresses || []
      }
      contractHeaderDetails={contractHeaderDetails.data}
      languageData={languageData}
      refundFeeHeaders={refundFeeHeaders.data.items || []}
    />
  );
}
