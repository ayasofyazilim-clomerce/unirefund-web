import {
  getMerchantContractHeaderByIdApi,
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
  getRefundTableHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import { getAdressesApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { ContractSettings } from "./_components/contract-settings";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
    contractId: string;
    partyName: "merchants";
  };
}) {
  const { lang, contractId, partyId, partyName } = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractSetting.Edit"],
    lang,
  });

  const { languageData } = await getResourceData(lang);

  const contractSettingsResponse =
    await getMerchantContractHeaderContractSettingsByHeaderIdApi({
      id: contractId,
    });
  if (isErrorOnRequest(contractSettingsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={contractSettingsResponse.message}
      />
    );
  }

  const refundTableHeadersResponse = await getRefundTableHeadersApi({});
  if (isErrorOnRequest(refundTableHeadersResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={refundTableHeadersResponse.message}
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

  return (
    <ContractSettings
      addressList={addressListResponse.data}
      contractHeaderDetails={contractHeaderDetailsResponse.data}
      contractSettings={contractSettingsResponse.data}
      lang={lang}
      languageData={languageData}
    />
  );
}
