import { auth } from "@repo/utils/auth/next-auth";
import {
  getMerchantContractHeaderByIdApi,
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
} from "src/actions/unirefund/ContractService/action";
import { getMerchantAddressByIdApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { ContractSettings } from "./_components/contract-settings";

async function getApiRequests(partyId: string, contractId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantContractHeaderContractSettingsByHeaderIdApi(
        {
          id: contractId,
        },
        session,
      ),
      getMerchantContractHeaderByIdApi(contractId, session),
      getMerchantAddressByIdApi(partyId, session),
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
  params: {
    lang: string;
    partyId: string;
    contractId: string;
  };
}) {
  const { lang, contractId, partyId } = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractSetting.Edit"],
    lang,
  });

  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests(partyId, contractId);
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }
  const [
    contractSettingsResponse,
    contractHeaderDetailsResponse,
    addressListResponse,
  ] = apiRequests.data;

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
