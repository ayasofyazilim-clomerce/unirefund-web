"use server";

import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTaxFreeByIdApi, getTaxFreesApi, getTaxOfficesApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import TaxFreeForm from "./form";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getTaxFreesApi({}, session),
      getTaxFreeByIdApi(partyId, session),
      getTaxOfficesApi({}, session),
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
}) {
  const {partyId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({partyId});
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [taxFreeResponse, taxFreeDetailResponse, taxOfficesResponse] = apiRequests.data;
  const taxFrees = taxFreeResponse.data;
  const taxFreeDetail = taxFreeDetailResponse.data;
  const taxOffices = taxOfficesResponse.data;

  const taxFreeList = taxFrees.items?.filter((taxFree) => taxFree.id !== partyId) || [];

  return (
    <TaxFreeForm
      languageData={languageData}
      partyId={partyId}
      taxFreeDetail={taxFreeDetail}
      taxFreeList={taxFreeList}
      taxOfficeList={taxOffices.items || []}
    />
  );
}
