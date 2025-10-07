import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getMerchantsApi} from "@repo/actions/unirefund/CrmService/actions";
import {getRebateTableHeadersApi} from "@repo/actions/unirefund/ContractService/action";
import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import RebateTableHeaderCreateForm from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getMerchantsApi({typeCodes: ["HEADQUARTER"], maxResultCount: 999}, session),
      getRebateTableHeadersApi({}, session),
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

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [merchantsResponse, rebateTablesResponse] = apiRequests.requiredRequests;

  return (
    <RebateTableHeaderCreateForm
      languageData={languageData}
      merchants={merchantsResponse.data.items || []}
      rebateTables={rebateTablesResponse.data.items || []}
    />
  );
}
