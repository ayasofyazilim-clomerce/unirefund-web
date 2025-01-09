import {
  getMerchantContractHeaderByIdApi,
  getMerchantContractHeadersByMerchantIdApi,
  getRefundFeeHeadersApi,
  getRefundPointContractHeaderById,
  getRefundPointContractHeadersByRefundPointIdApi,
  getRefundTableHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import {
  getAdressesApi,
  getRefundPointDetailsByIdApi,
} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import type { ContractPartyName } from "../../_components/types";
import { ContractHeader as MerchantContractHeader } from "./_components/merchant";
import { ContractHeader as RefundPointContractHeader } from "./_components/refund-point";

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

    const refundTableHeadersResponse = await getRefundTableHeadersApi({});
    if (isErrorOnRequest(refundTableHeadersResponse, lang, false)) {
      return (
        <ErrorComponent
          languageData={languageData}
          message={refundTableHeadersResponse.message}
        />
      );
    }

    const otherContractHeadersResponse =
      await getMerchantContractHeadersByMerchantIdApi({
        id: partyId,
        isDraft: false,
      });
    if (isErrorOnRequest(otherContractHeadersResponse, lang, false)) {
      return (
        <ErrorComponent
          languageData={languageData}
          message={otherContractHeadersResponse.message}
        />
      );
    }

    const contractHeaderDetailsResponse =
      await getMerchantContractHeaderByIdApi(contractId);
    if (isErrorOnRequest(contractHeaderDetailsResponse, lang, false)) {
      return (
        <ErrorComponent
          languageData={languageData}
          message={contractHeaderDetailsResponse.message}
        />
      );
    }

    const addressListResponse = await getAdressesApi(partyId, partyName);
    if (isErrorOnRequest(addressListResponse, lang, false)) {
      return (
        <ErrorComponent
          languageData={languageData}
          message={addressListResponse.message}
        />
      );
    }

    const contractHeaders = otherContractHeadersResponse.data.items;
    const activeContract = contractHeaders?.find((i) => i.isActive === true);

    return (
      <MerchantContractHeader
        addressList={addressListResponse.data}
        contractHeaderDetails={contractHeaderDetailsResponse.data}
        fromDate={
          activeContract ? new Date(activeContract.validTo) : new Date()
        }
        languageData={languageData}
        refundTableHeaders={refundTableHeadersResponse.data.items || []}
      />
    );
  }

  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForRefundPoint.Edit"],
    lang,
  });
  const refundFeeHeadersResponse = await getRefundFeeHeadersApi({});
  if (isErrorOnRequest(refundFeeHeadersResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={refundFeeHeadersResponse.message}
      />
    );
  }

  const contractHeaderDetailsResponse =
    await getRefundPointContractHeaderById(contractId);
  if (isErrorOnRequest(contractHeaderDetailsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={contractHeaderDetailsResponse.message}
      />
    );
  }

  const refundPointDetailsResponse = await getRefundPointDetailsByIdApi(
    params.partyId,
  );
  if (isErrorOnRequest(refundPointDetailsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={refundPointDetailsResponse.message}
      />
    );
  }

  const otherContractHeadersResponse =
    await getRefundPointContractHeadersByRefundPointIdApi({
      id: partyId,
      isDraft: false,
    });
  if (isErrorOnRequest(otherContractHeadersResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={otherContractHeadersResponse.message}
      />
    );
  }

  const refundPointDetailsSummary =
    refundPointDetailsResponse.data.entityInformations
      ?.at(0)
      ?.organizations?.at(0);

  const contractHeaders = otherContractHeadersResponse.data.items;
  const activeContract = contractHeaders?.find((i) => i.isActive === true);

  return (
    <RefundPointContractHeader
      addressList={
        refundPointDetailsSummary?.contactInformations?.at(0)?.addresses || []
      }
      contractHeaderDetails={contractHeaderDetailsResponse.data}
      fromDate={activeContract ? new Date(activeContract.validTo) : new Date()}
      languageData={languageData}
      refundFeeHeaders={refundFeeHeadersResponse.data.items || []}
    />
  );
}
