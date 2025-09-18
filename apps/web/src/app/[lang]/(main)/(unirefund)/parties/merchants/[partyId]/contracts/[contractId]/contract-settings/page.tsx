import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import type {Session} from "@repo/utils/auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getMerchantContractHeaderByIdApi,
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getMerchantAddressesByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {ContractSettings} from "./_components/contract-settings";

async function getApiRequests(session: Session | null, partyId: string, contractId: string) {
  try {
    const apiRequests = await Promise.all([
      getMerchantContractHeaderByIdApi(contractId, session),
      getMerchantAddressesByIdApi(partyId, session),
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
  const {lang, contractId, partyId} = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.ConractSettingView"],
    lang,
  });

  const {languageData} = await getResourceData(lang);
  const session = await auth();

  const apiRequests = await getApiRequests(session, partyId, contractId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [contractHeaderDetailsResponse, addressListResponse] = apiRequests.data;
  const contractSettingsResponse = await getMerchantContractHeaderContractSettingsByHeaderIdApi({
    id: contractId,
  });
  return (
    <ContractSettings
      addressList={addressListResponse.data}
      contractHeaderDetails={contractHeaderDetailsResponse.data}
      contractSettings={contractSettingsResponse.type === "success" ? contractSettingsResponse.data.items || [] : []}
      lang={lang}
      languageData={languageData}
    />
  );
}
