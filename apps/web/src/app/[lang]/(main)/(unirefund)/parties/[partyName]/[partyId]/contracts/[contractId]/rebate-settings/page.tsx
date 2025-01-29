import {
  getMerchantContractHeaderRebateSettingsByHeaderIdApi,
  getRebateTableHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import {
  getIndividualsByIdApi,
  getSubMerchantsByMerchantIdApi,
} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { RebateSettings } from "./_components/rebate-settings";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
    contractId: string;
  };
}) {
  const { lang, partyId, contractId } = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.RebateSetting.Edit"],
    lang,
  });

  const { languageData } = await getResourceData(lang);
  const rebateSettings =
    await getMerchantContractHeaderRebateSettingsByHeaderIdApi(contractId);

  const rebateTables = await getRebateTableHeadersApi({});
  if (isErrorOnRequest(rebateTables, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={rebateTables.message}
      />
    );
  }

  const subMerchantsResponse = await getSubMerchantsByMerchantIdApi({
    id: partyId,
  });
  if (isErrorOnRequest(subMerchantsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={subMerchantsResponse.message}
      />
    );
  }

  const individualsResponse = await getIndividualsByIdApi("merchants", {
    id: partyId,
  });
  if (isErrorOnRequest(individualsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={individualsResponse.message}
      />
    );
  }

  return (
    <RebateSettings
      contractId={contractId}
      individuals={individualsResponse.data.items || []}
      // lang={lang}
      languageData={languageData}
      rebateSettings={
        rebateSettings.type === "success" ? rebateSettings.data : undefined
      }
      rebateTableHeaders={rebateTables.data.items || []}
      subMerchants={subMerchantsResponse.data.items || []}
    />
  );
}
