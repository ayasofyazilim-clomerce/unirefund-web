import { FormReadyComponent } from "@repo/ui/form-ready";
import { auth } from "@repo/utils/auth/next-auth";
import { FileText } from "lucide-react";
import {
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
  getMerchantContractHeadersContractStoresByHeaderIdApi,
} from "src/actions/unirefund/ContractService/action";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { ContractStoresTable } from "./_components/table";

async function getApiRequests(contractId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantContractHeaderContractSettingsByHeaderIdApi(
        {
          id: contractId,
        },
        session,
      ),
      await getMerchantContractHeadersContractStoresByHeaderIdApi(
        {
          id: contractId,
        },
        session,
      ),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}

export default async function Page({
  params,
}: {
  params: { contractId: string; lang: string };
}) {
  const { contractId, lang } = params;
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractStore",
      "ContractService.ContractStore.Edit",
      "ContractService.ContractStore.Delete",
      "ContractService.ContractStore.Create",
    ],
    lang,
  });

  const { languageData } = await getResourceData(lang);
  const apiRequests = await getApiRequests(contractId);
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }
  const [contractSettingsResponse, contractStoresResponse] = apiRequests.data;

  return (
    <FormReadyComponent
      active={false}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.ContractStores.Title"],
        message: languageData["Missing.ContractStores.Message"],
      }}
    >
      <ContractStoresTable
        contractSettings={contractSettingsResponse.data.items || []}
        contractStores={contractStoresResponse.data.items || []}
        languageData={languageData}
      />
    </FormReadyComponent>
  );
}
