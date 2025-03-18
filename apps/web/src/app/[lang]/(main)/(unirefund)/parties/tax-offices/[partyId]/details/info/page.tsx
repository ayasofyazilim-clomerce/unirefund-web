"use server";

import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTaxOfficeByIdApi, getTaxOfficesApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import TaxOfficeForm from "./form";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getTaxOfficesApi({}, session), getTaxOfficeByIdApi(partyId, session)]);
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

  const [taxOfficesResponse, taxOfficeDetailResponse] = apiRequests.data;
  const taxOffices = taxOfficesResponse.data;
  const taxOfficeDetail = taxOfficeDetailResponse.data;

  const taxOfficeList = taxOffices.items?.filter((taxOffice) => taxOffice.id !== partyId) || [];

  return (
    <TaxOfficeForm
      languageData={languageData}
      partyId={partyId}
      taxOfficeDetail={taxOfficeDetail}
      taxOfficeList={taxOfficeList}
    />
  );
}
