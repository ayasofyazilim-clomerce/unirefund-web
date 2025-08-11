import {Button} from "@/components/ui/button";
import {
  getMerchantContractHeaderRebateSettingsByHeaderIdApi,
  getRebateTableHeadersAssignablesByMerchantIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getMerchantAffiliationsByMerchantIdApi, getMerchantsApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {FileText} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {RebateSettings} from "./_components/rebate-settings";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getRebateTableHeadersAssignablesByMerchantIdApi({merchantId: partyId}, session),
      getMerchantsApi({parentId: partyId}, session),
      getMerchantAffiliationsByMerchantIdApi({merchantId: partyId}, session),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
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
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.ViewRebateSetting"],
    lang,
  });

  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests(partyId);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [rebateTablesResponse, subMerchantsResponse, individualsResponse] = apiRequests.requiredRequests;
  const rebateSettingsResponse = await getMerchantContractHeaderRebateSettingsByHeaderIdApi(contractId);
  return (
    <FormReadyComponent
      active={!rebateTablesResponse.data.length}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.RebateTableHeaders.Title"],
        message: languageData["Missing.RebateTableHeaders.Message"],
        action: (
          <Button asChild className="text-blue-500" variant="link">
            <Link href={getBaseLink("settings/templates/rebate-tables/new", lang)}>{languageData.New}</Link>
          </Button>
        ),
      }}>
      <RebateSettings
        contractId={contractId}
        individuals={individualsResponse.data.items || []}
        languageData={languageData}
        rebateSettings={rebateSettingsResponse.type === "success" ? rebateSettingsResponse.data : undefined}
        rebateTableHeaders={rebateTablesResponse.data}
        subMerchants={subMerchantsResponse.data.items || []}
      />
    </FormReadyComponent>
  );
}
