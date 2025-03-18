"use server";

import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundPointContractHeadersByRefundPointIdApi} from "@repo/actions/unirefund/ContractService/action";
import {getResourceData} from "@/language-data/unirefund/CRMService";
import {getResourceData as getContractsResourceData} from "src/language-data/unirefund/ContractService";
import ContractsTable from "./_components/table";

interface SearchParamType {
  affiliationCodeId?: number;
  email?: string;
  entityInformationTypeCode?: "INDIVIDUAL" | "ORGANIZATION";
  id: string;
  maxResultCount?: number;
  name?: string;
  skipCount?: number;
  sorting?: string;
  telephone?: string;
}

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundPointContractHeadersByRefundPointIdApi(
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
    partyId: string;
    lang: string;
  };
  searchParams?: SearchParamType;
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);
  const {languageData: contractsLanguageData} = await getContractsResourceData(lang);
  const apiRequests = await getApiRequests(partyId);

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [contractsResponse] = apiRequests.data;

  return (
    <ContractsTable
      contractsData={contractsResponse.data}
      lang={lang}
      languageData={{...languageData, ...contractsLanguageData}}
      partyId={partyId}
    />
  );
}
