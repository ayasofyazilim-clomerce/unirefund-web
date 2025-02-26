"use server";

import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getMerchantByIdApi,
  getMerchantDetailByIdApi,
  getMerchantsApi,
  getTaxOfficesApi,
} from "src/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import MerchantForm from "./form";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantsApi(
        {
          typeCodes: ["HEADQUARTER"],
        },
        session,
      ),
      getMerchantByIdApi(partyId, session),
      getTaxOfficesApi({}, session),
      getMerchantDetailByIdApi(partyId, session),
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

  const [merchantsResponse, merchantDetailResponse, taxOfficesResponse, taxOfficeResponse] = apiRequests.data;
  const merchants = merchantsResponse.data;
  const merchantDetail = merchantDetailResponse.data;
  const taxOffices = taxOfficesResponse.data;
  const taxOfficeId = taxOfficeResponse.data.merchant?.taxOfficeId;

  const merchantList = merchants.items?.filter((merchant) => merchant.id !== partyId) || [];

  return (
    <MerchantForm
      languageData={languageData}
      merchantDetail={merchantDetail}
      merchantList={merchantList}
      partyId={partyId}
      taxOfficeId={taxOfficeId || ""}
      taxOfficeList={taxOffices.items || []}
    />
  );
}
