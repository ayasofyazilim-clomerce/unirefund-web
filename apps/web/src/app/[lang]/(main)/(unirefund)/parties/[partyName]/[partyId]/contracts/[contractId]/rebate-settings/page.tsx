import { notFound } from "next/navigation";
import {
  getMerchantContractHeaderRebateSettingsByHeaderIdApi,
  getRebateTableHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import { getSubMerchantsByMerchantIdApi } from "src/actions/unirefund/CrmService/actions";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
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
  if (rebateSettings.type !== "success") return notFound();
  const rebateTables = await getRebateTableHeadersApi({});
  const subMerchants = await getSubMerchantsByMerchantIdApi({
    id: partyId,
  });
  if (rebateTables.type !== "success" || subMerchants.type !== "success") {
    return notFound();
  }
  return (
    <RebateSettings
      contractId={contractId}
      lang={lang}
      languageData={languageData}
      rebateSettings={rebateSettings.data}
      rebateTables={rebateTables.data.items || []}
      subMerchants={subMerchants.data.items || []}
    />
  );
}
