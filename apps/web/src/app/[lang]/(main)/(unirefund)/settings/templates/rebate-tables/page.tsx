import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import type {GetApiContractServiceRebateTableHeadersData} from "@repo/saas/ContractService";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRebateTableHeadersApi} from "@repo/actions/unirefund/ContractService/action";
import {getMerchantsApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RebateTable from "./_components/table";

async function getApiRequests(filters: GetApiContractServiceRebateTableHeadersData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRebateTableHeadersApi(filters, session),
      getMerchantsApi({typeCodes: ["HEADQUARTER"]}, session),
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
  searchParams,
}: {
  params: {lang: string};
  searchParams?: GetApiContractServiceRebateTableHeadersData;
}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.RebateTableHeader", "ContractService.RebateTableHeader.ViewDetail"],
    lang,
  });
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests({
    isTemplate: searchParams?.isTemplate,
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  });
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [rebateTableHeadersResponse, merchantResponse] = apiRequests.data;
  return (
    <RebateTable
      lang={params.lang}
      languageData={languageData}
      merchants={merchantResponse.data.items || []}
      rebateTableHeaders={rebateTableHeadersResponse.data}
    />
  );
}
