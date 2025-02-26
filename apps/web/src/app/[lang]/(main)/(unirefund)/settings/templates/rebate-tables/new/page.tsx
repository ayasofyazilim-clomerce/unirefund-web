import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getMerchantsApi} from "@/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {getRebateTableHeadersApi} from "@/actions/unirefund/ContractService/action";
import RebateTableHeaderCreateForm from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantsApi({typeCodes: ["HEADQUARTER"]}, session),
      getRebateTableHeadersApi({}, session),
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
export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: [
      "CRMService.Merchants",
      "ContractService.RebateTableHeader.ViewList",
      "ContractService.RebateTableHeader.Create",
    ],
    lang,
  });
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests();

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [merchantsResponse, rebateTablesResponse] = apiRequests.data;

  return (
    <RebateTableHeaderCreateForm
      languageData={languageData}
      merchants={merchantsResponse.data.items || []}
      rebateTables={rebateTablesResponse.data.items || []}
    />
  );
}
