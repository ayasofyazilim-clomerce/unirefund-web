"use server";

import {
  getMerchantByIdApi,
  getMerchantsApi,
  getTaxOfficesApi,
} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import MerchantForm from "./form";

async function getApiRequests({ merchantId }: { merchantId: string }) {
  try {
    const apiRequests = await Promise.all([
      getMerchantsApi(),
      getMerchantByIdApi(merchantId),
      getTaxOfficesApi(),
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
    merchantId: string;
    lang: string;
  };
}) {
  const { merchantId, lang } = params;
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests({ merchantId });
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [merchantsResponse, merchantDetailResponse, taxOfficesResponse] =
    apiRequests.data;
  const merchants = merchantsResponse.data;
  const merchantDetail = merchantDetailResponse.data;
  const taxOffices = taxOfficesResponse.data;

  const merchantList =
    merchants.items?.filter((merchant) => merchant.id !== merchantId) || [];
  const taxOfficeList = taxOffices.items || [];

  return (
    <MerchantForm
      languageData={languageData}
      merchantDetail={merchantDetail}
      merchantList={merchantList}
      partyId={merchantId}
      taxOfficeList={taxOfficeList}
    />
  );
}
