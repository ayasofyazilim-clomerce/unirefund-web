import {Button} from "@/components/ui/button";
import {
  getMerchantContractHeaderRebateSettingsByHeaderIdApi,
  getRebateTableHeadersAssignablesByMerchantIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getMerchantAffiliationByIdApi, getMerchantSubStoresByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {FileText} from "lucide-react";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {RebateSettings} from "./_components/rebate-settings";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRebateTableHeadersAssignablesByMerchantIdApi({merchantId: partyId}, session),
      getMerchantSubStoresByIdApi(
        {
          id: partyId,
        },
        session,
      ),
      getMerchantAffiliationByIdApi(
        {
          id: partyId,
        },
        session,
      ),
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
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.ViewRebateSetting"],
    lang,
  });

  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests(partyId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [rebateTablesResponse, subMerchantsResponse, individualsResponse] = apiRequests.data;
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
